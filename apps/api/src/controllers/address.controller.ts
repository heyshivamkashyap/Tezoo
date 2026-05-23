import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { addressSchema } from "@repo/utils";
import { ApiError } from "../utils/ApiError";
import { AddressModel } from "../models/address.model";
import { UserModel } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";

export const createAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedAddress = addressSchema.safeParse(req.body);

    // check required fields are present
    if (!parsedAddress.success) {
      throw new ApiError(400, "Invalid address data");
    }

    // limit number of addresses per user
    const count = await AddressModel.countDocuments({
      user: req.user?._id,
    }).lean();

    if (count >= 3) {
      throw new ApiError(400, "Address limit reached");
    }

    // create new address for logged-in user
    const createdAddress = await AddressModel.create({
      user: req.user?._id,
      ...parsedAddress.data,
    });

    // Set as default if it's the first address
    if (count === 0) {
      await UserModel.findByIdAndUpdate(req.user?._id, {
        defaultAddress: createdAddress._id,
      });
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, createdAddress, "Address created successfully"),
      );
  },
);

export const getUserAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    // check user
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    // get all addresses of logged-in user
    const addresses = await AddressModel.find({
      user: req.user._id,
    })
      .sort({
        isDefault: -1,
        createdAt: -1,
      })
      .lean();

    const allAddresses = addresses.map((add) => ({
      ...add,
      isDefault: String(add._id) === String(req.user?.defaultAddress),
    }));

    return res.json(
      new ApiResponse(200, allAddresses, "Addresses fetched successfully"),
    );
  },
);

export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { addressId } = req.params;

    // check user
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    // validate request body
    const parsedAddress = addressSchema.partial().safeParse(req.body);

    if (!parsedAddress.success) {
      throw new ApiError(400, "Invalid address data");
    }

    // find address
    const existingAddress = await AddressModel.findOne({
      _id: addressId,
      user: req.user._id,
    })
      .select("_id")
      .lean();

    if (!existingAddress) {
      throw new ApiError(404, "Address not found");
    }

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      {
        $set: parsedAddress.data,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedAddress, "Address updated successfully"),
      );
  },
);

export const setDefaultAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { addressId } = req.params;

    // check user
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    // find address
    const address = await AddressModel.findOne({
      _id: addressId,
      user: req.user._id,
    })
      .select("_id")
      .lean();

    if (!address) {
      throw new ApiError(404, "Address not found");
    }

    // update user default address
    await UserModel.findByIdAndUpdate(req.user._id, {
      $set: {
        defaultAddress: addressId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Default address updated successfully"));
  },
);

export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { addressId } = req.params;

    // check user
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    // find address
    const address = await AddressModel.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      throw new ApiError(404, "Address not found");
    }

    // delete address
    await address.deleteOne();

    if (
      req.user.defaultAddress &&
      String(req.user.defaultAddress) === String(addressId)
    ) {
      // find another address
      const nextAddress = await AddressModel.findOne({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

      if (nextAddress) {
        await UserModel.findByIdAndUpdate(req.user._id, {
          defaultAddress: nextAddress._id,
        });
      } else {
        await UserModel.findByIdAndUpdate(req.user._id, {
          $unset: {
            defaultAddress: 1,
          },
        });
      }
    }

    return res.json(new ApiResponse(200, null, "Address deleted successfully"));
  },
);
