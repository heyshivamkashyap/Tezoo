import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { StoreModel } from "../../modules/store/store.model";
import { ApiResponse } from "../../utils/ApiResponse";

export const getNearbyStore = asyncHandler(
  async (req: Request, res: Response) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      throw new ApiError(400, "Latitude and longitude are required");
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      throw new ApiError(400, "Invalid coordinates");
    }

    const store = await StoreModel.findOne({
      status: "active",
      geoLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 3000,
        },
      },
    })
      .select("_id")
      .lean();

    if (store) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { storeId: store._id },
            "Nearby store found successfully",
          ),
        );
    }

    // Fallback for testing/demo purposes.
    // If no active store is found within 3 KM,
    // return the default admin/test store.
    const defaultStore = await StoreModel.findOne({
      storeCode: "STR001",
      status: "active",
    })
      .select("_id")
      .lean();

    if (!defaultStore) {
      throw new ApiError(404, "Default store not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { storeId: defaultStore._id },
          "Default store returned",
        ),
      );
  },
);
