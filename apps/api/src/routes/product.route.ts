import express, { type Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import {
  createProduct,
  deleteProduct,
  removeProductImage,
  updateProduct,
} from "../controllers/product.controller";
import { upload } from "../middleware/multer.middleware";

const router: Router = express.Router();

// create product
router.post(
  "/create",
  authenticate(["admin"]),
  upload.array("image", 10),
  createProduct,
);

router.patch(
  "/update/:productId",
  authenticate(["admin"]),
  upload.array("image", 10),
  updateProduct,
);

// remove product image
router.delete(
  "/remove-image/:productId",
  authenticate(["admin"]),
  removeProductImage,
);

router.delete("/delete/:productId", authenticate(["admin"]), deleteProduct);

export default router;
