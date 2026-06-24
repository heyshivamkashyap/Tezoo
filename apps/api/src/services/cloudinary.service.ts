import cloudinary from "../config/cloudinary";
import { ApiError } from "../utils/ApiError";

export type CloudinaryFolder = "category" | "product" | "user";

export const uploadToCloudinary = async (
  filePath: string,
  folder: CloudinaryFolder,
) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      folder,
    });
  } catch (error) {
    throw new ApiError(500, "Failed to upload file to Cloudinary");
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId?.trim()) {
      throw new ApiError(400, "Public ID is required");
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new ApiError(500, "Failed to delete file from Cloudinary");
  }
};
