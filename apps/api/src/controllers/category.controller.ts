import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createCategorySchema,
  updateCategorySchema,
  UpdateCategoryType,
} from "@repo/utils";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../services/cloudinary.service";
import slugify from "slugify";
import { CategoryModel } from "../modules/category/category.model";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const body = {
      ...req.body,
      isActive: req.body.isActive === "true",
    };

    const validatedData = createCategorySchema.safeParse(body);

    if (!validatedData.success) {
      throw new ApiError(400, "Invalid category data");
    }

    if (!req.file) {
      throw new ApiError(400, "Category image is required");
    }

    const { name, parentId, isActive } = validatedData.data;

    const slug = slugify(name, {
      lower: true,
      trim: true,
      strict: true,
    });

    // check duplicate category inside same parent
    const existingCategory = await CategoryModel.findOne({
      slug,
      parentId: parentId || null,
    });

    if (existingCategory) {
      throw new ApiError(409, "Category already exists");
    }

    const { secure_url, public_id } = await uploadToCloudinary(
      req.file.path,
      "category",
    );

    if (!secure_url) {
      throw new ApiError(500, "Failed to upload category image");
    }

    const category = await CategoryModel.create({
      name,
      slug,
      image: {
        url: secure_url,
        publicId: public_id,
      },
      parentId: parentId || null,
      isActive,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    // Check category exists
    const category = await CategoryModel.findById(categoryId)
      .select("_id parentId image")
      .lean();

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Validate request body
    const validatedData = updateCategorySchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new ApiError(
        400,
        validatedData.error.issues[0]?.message || "Invalid category data",
      );
    }

    // Add internal fields used during update
    const updatePayload: UpdateCategoryType & {
      slug?: string;
      image?: {
        url: string;
        publicId: string;
      };
    } = validatedData.data;

    // Generate slug if name is updated
    if (updatePayload.name) {
      const slug = slugify(updatePayload.name, {
        lower: true,
        trim: true,
        strict: true,
      });

      // Check duplicate category under same parent
      const existingCategory = await CategoryModel.findOne({
        _id: { $ne: categoryId },
        slug,
        parentId:
          updatePayload.parentId !== undefined
            ? updatePayload.parentId
            : category.parentId,
      })
        .select("_id")
        .lean();

      if (existingCategory) {
        throw new ApiError(409, "Category already exists");
      }

      updatePayload.slug = slug;
    }

    // Upload image if provided
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.path, "category");

      if (!uploadedImage.secure_url) {
        throw new ApiError(500, "Failed to upload category image");
      }

      await deleteFromCloudinary(String(category.image.publicId));

      updatePayload.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      updatePayload,
      {
        runValidators: true,
        returnDocument: "after",
      },
    );

    if (!updatedCategory) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCategory, "Category updated successfully"),
      );
  },
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    // check category exists
    const category =
      await CategoryModel.findById(categoryId).select("_id image");

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // prevent deletion if category has subcategories
    const subCategoryExists = await CategoryModel.exists({
      parentId: categoryId,
    });

    if (subCategoryExists) {
      throw new ApiError(
        400,
        "Cannot delete category because it contains subcategories",
      );
    }

    // delete category image from cloudinary
    await deleteFromCloudinary(String(category.image.publicId));

    await category.deleteOne();

    return res.json(
      new ApiResponse(200, null, "Category deleted successfully"),
    );
  },
);

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await CategoryModel.find({
      parentId: null,
    })
      .select("_id name slug image isActive")
      .lean();

    return res.json(
      new ApiResponse(200, categories, "Categories fetched successfully"),
    );
  },
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const category = await CategoryModel.findById(categoryId).lean();

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return res.json(
      new ApiResponse(200, category, "Categories fetched successfully"),
    );
  },
);

export const getSubCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    // check parent category exists
    const category = await CategoryModel.findById(categoryId)
      .select("_id name")
      .lean();

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const subCategories = await CategoryModel.find({
      parentId: categoryId,
      isActive: true,
    })
      .select("_id name slug image isActive")
      .lean();

    return res.json(
      new ApiResponse(
        200,
        {
          parentCategory: category,
          subCategories,
        },
        "Subcategories fetched successfully",
      ),
    );
  },
);
