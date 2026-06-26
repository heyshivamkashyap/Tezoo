// imort
import express, { type Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import {
  createProductVariant,
  deleteProductVariant,
  updateProductVariant,
} from "../controllers/product-variant.controller";

const router: Router = express.Router();

router.post(
  "/create/:productId",
  authenticate(["admin"]),
  createProductVariant,
);

router.patch(
  "/update/:variantId",
  authenticate(["admin"]),
  updateProductVariant,
);

router.delete(
  "/delete/:variantId",
  authenticate(["admin"]),
  deleteProductVariant,
);

export default router;
