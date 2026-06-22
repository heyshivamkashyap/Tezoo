import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { StoreModel } from "../../modules/store/store.model";
import { createStoreSchema, updateStoreSchema } from "@repo/utils";
import { ApiResponse } from "../../utils/ApiResponse";

export const createStore = asyncHandler(async (req: Request, res: Response) => {
  // check authentication
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  // check default address
  if (!req.user.defaultAddress) {
    throw new ApiError(400, "Please add and select a default address first");
  }

  // check if user already owns a store
  const userStore = await StoreModel.findOne({
    createdBy: req.user._id,
  })
    .select("_id name")
    .lean();

  if (userStore) {
    throw new ApiError(409, `You already have a store '${userStore.name}'`);
  }

  // validate request body
  const validatedData = createStoreSchema.safeParse(req.body);

  if (!validatedData.success) {
    throw new ApiError(400, "Invalid store data");
  }

  const storeData = validatedData.data;

  // check email availability
  const emailExists = await StoreModel.findOne({
    store_email: storeData.email,
  })
    .select("_id")
    .lean();

  if (emailExists) {
    throw new ApiError(409, "Store email already in use");
  }

  const count = await StoreModel.countDocuments();
  const storeCode = `STR${String(count + 1).padStart(3, "0")}`;

  // create store
  const newStore = await StoreModel.create({
    createdBy: req.user._id, // store owner

    storeCode: storeCode,

    name: storeData.name,
    phone: storeData.phone,
    email: storeData.email,

    address: req.user.defaultAddress,
    geoLocation: storeData.geoLocation,

    isOpen: storeData.isOpen || true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newStore, "Store created successfully"));
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;

  // check authentication
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  // validate request body
  const validatedData = updateStoreSchema.safeParse(req.body);

  if (!validatedData.success) {
    throw new ApiError(400, "Invalid store update data");
  }

  const updateData = validatedData.data;

  // find store
  const existingStore = await StoreModel.findOne({
    _id: storeId,
    createdBy: req.user._id,
  })
    .select("_id status")
    .lean();

  if (!existingStore) {
    throw new ApiError(404, "Store not found");
  }

  if (existingStore.status !== "active") {
    throw new ApiError(
      403,
      "Only active stores can be updated. Please contact support for assistance.",
    );
  }

  // check email availability
  if (updateData.email) {
    const emailExists = await StoreModel.findOne({
      email: updateData.email,
      _id: { $ne: storeId },
    })
      .select("_id")
      .lean();

    if (emailExists) {
      throw new ApiError(409, "Store email already in use");
    }
  }

  // update store
  const updatedStore = await StoreModel.findByIdAndUpdate(
    storeId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedStore, "Store updated successfully"));
});
