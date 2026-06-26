import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import {
  createProductVariantSchema,
  updateProductVariantSchema,
} from "@repo/utils";
import { ProductModel } from "../modules/product/product.model";
import { ProductVariantModel } from "../modules/product/product-variant.model";
import { StoreInventoryModel } from "../modules/store/store-inventory.model";

export const createProductVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    // validate request body
    const validatedData = createProductVariantSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new ApiError(400, "Invalid input data");
    }

    const { sku, mrp, barcode, unit, weight, isActive } = validatedData.data;

    // check product exists
    const product = await ProductModel.findById(productId)
      .select("_id slug")
      .lean();

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // check variant already exists
    const existingVariant = await ProductVariantModel.findOne({
      productId: product._id,
      unit,
      weight,
    })
      .select("_id sku")
      .lean();

    if (existingVariant) {
      throw new ApiError(
        409,
        `Variant with same weight and unit already exists (${existingVariant.sku})`,
      );
    }

    // check sku already exists
    const existingSku = await ProductVariantModel.findOne({
      sku,
    })
      .select("_id")
      .lean();

    if (existingSku) {
      throw new ApiError(409, "SKU already exists");
    }

    const variant = await ProductVariantModel.create({
      productId: product._id,
      sku,
      mrp,
      barcode,
      unit,
      weight,
      isActive,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, variant, "Product variant created successfully"),
      );
  },
);

export const updateProductVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { variantId } = req.params;

    // validate request body
    const validatedData = updateProductVariantSchema.safeParse(req.body);

    if (!validatedData.success) {
      throw new ApiError(400, "Invalid input data");
    }

    // check variant exists
    const variant = await ProductVariantModel.findById(variantId);

    if (!variant) {
      throw new ApiError(404, "Product variant not found");
    }

    // Use updated values if provided; otherwise, fall back to the existing variant values.
    const {
      sku = variant.sku,
      weight = variant.weight,
      unit = variant.unit,
    } = validatedData.data;

    // check duplicate variant
    const existingVariant = await ProductVariantModel.findOne({
      productId: variant.productId,
      weight,
      unit,
      _id: { $ne: variantId },
    })
      .select("_id")
      .lean();

    if (existingVariant) {
      throw new ApiError(
        409,
        "Variant with the same weight and unit already exists",
      );
    }

    // check duplicate sku
    const existingSku = await ProductVariantModel.findOne({
      sku,
      _id: { $ne: variantId },
    })
      .select("_id")
      .lean();

    if (existingSku) {
      throw new ApiError(409, "SKU already exists");
    }

    const updatedVariant = await ProductVariantModel.findByIdAndUpdate(
      variantId,
      {
        ...validatedData.data,
        sku,
      },
      {
        returnDocument: "after",
      },
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedVariant,
          "Product variant updated successfully",
        ),
      );
  },
);

export const deleteProductVariant = asyncHandler(
  async (req: Request, res: Response) => {
    const { variantId } = req.params;

    // check variant exists
    const variant = await ProductVariantModel.findById(variantId)
      .select("_id")
      .lean();

    if (!variant) {
      throw new ApiError(404, "Product variant not found");
    }

    const existingStoreInventory = await StoreInventoryModel.exists({
      variantId,
    });

    if (existingStoreInventory) {
      throw new ApiError(
        409,
        "Cannot delete product variant because it is associated with store inventory",
      );
    }

    // delete variant
    await ProductVariantModel.findByIdAndDelete(variantId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Product variant deleted successfully"));
  },
);
