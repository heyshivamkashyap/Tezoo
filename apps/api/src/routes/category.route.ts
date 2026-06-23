import express, { type Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { upload } from "../middleware/multer.middleware";
import {
  createCategory,
  updateCategory,
} from "../controllers/category.controller";

const router: Router = express.Router();

// create new category
router.post(
  "/create",
  authenticate(["admin"]),
  upload.single("image"),
  createCategory,
);

router.patch(
  "/update/:categoryId",
  authenticate(["admin"]),
  upload.single("image"),
  updateCategory,
);

export default router;
