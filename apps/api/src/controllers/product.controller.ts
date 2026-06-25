import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { createProductSchema, updateProductSchema } from "@repo/utils";
import { CategoryModel } from "../modules/category/category.model";
import slugify from "slugify";
import { ProductModel } from "../modules/product/product.model";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../services/cloudinary.service";
import { Types } from "mongoose";
import { ProductVariantModel } from "../modules/product/product-variant.model";

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    // validate images
    const files = req.files as Express.Multer.File[];

    if (!files) {
      throw new ApiError(400, "At least one product image is required");
    }

    // validate request body
    const validatedData = createProductSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new ApiError(400, "Invalid input data");
    }

    const { name, description, brand, categoryId, tags, isActive } =
      validatedData.data;

    const slug = slugify(name, {
      lower: true,
      trim: true,
      strict: true,
    });

    // check category
    const category = await CategoryModel.findById(categoryId)
      .select("_id")
      .lean();

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // check slug
    const existingProduct = await ProductModel.findOne({ slug })
      .select("_id name slug")
      .lean();

    if (existingProduct) {
      throw new ApiError(
        409,
        `Product already exists \n name: ${existingProduct.name} \n slug: ${existingProduct.slug}`,
      );
    }

    // upload images to cloudinary
    const images = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(file.path, "product");

        return {
          url: result.secure_url,
          publicId: result.public_id,
        };
      }),
    );

    // create product
    const product = await ProductModel.create({
      name,
      slug,
      description,
      brand,
      categoryId,
      images,
      tags,
      isActive,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { product }, "Product created successfully"));
  },
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    const validatedData = updateProductSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new ApiError(400, "Invalid input data");
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const { name, description, brand, categoryId, tags, isActive } =
      validatedData.data;

    if (name && name != product.name) {
      const slug = slugify(name, {
        lower: true,
        trim: true,
        strict: true,
      });

      const existingProduct = await ProductModel.findOne({
        slug,
        _id: {
          $ne: productId,
        },
      })
        .select("_id")
        .lean();

      if (existingProduct) {
        throw new ApiError(409, "Product name already exists");
      }

      product.name = name;
      product.slug = slug;
    }

    if (description !== undefined) product.description = description;
    if (brand !== undefined) product.brand = brand;
    if (categoryId !== undefined)
      product.categoryId = new Types.ObjectId(categoryId);
    if (tags !== undefined) product.tags = tags;
    if (isActive !== undefined) product.isActive = isActive;

    const files = req.files as Express.Multer.File[];

    if (files?.length) {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const result = await uploadToCloudinary(file.path, "product");

          return {
            url: result.secure_url,
            publicId: result.public_id,
          };
        }),
      );

      product.images.push(...newImages);
    }

    await product.save();

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  },
);

export const removeProductImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { publicId } = req.body;

    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const imageExists = product.images.some(
      (image) => image.publicId === publicId,
    );

    if (!imageExists) {
      throw new ApiError(404, "Image not found");
    }

    // delete from cloudinary
    await deleteFromCloudinary(String(publicId));

    // remove from product
    product.images = product.images.filter(
      (image) => image.publicId !== publicId,
    );

    await product.save({
      validateBeforeSave: true,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, product, "Product image deleted successfully"),
      );
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // Check variants
    const variantCount = await ProductVariantModel.countDocuments({
      productId,
    });

    if (variantCount > 0) {
      throw new ApiError(
        400,
        "Cannot delete product because variants exist. Delete variants first.",
      );
    }

    // Delete product images from Cloudinary
    if (product.images.length) {
      await Promise.all(
        product.images.map((image) =>
          deleteFromCloudinary(String(image.publicId)),
        ),
      );
    }

    await product.deleteOne();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  },
);
