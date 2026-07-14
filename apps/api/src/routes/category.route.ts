import express, { type Router } from "express";
import { authenticate } from "../middleware/authenticate.middleware";
import { upload } from "../middleware/multer.middleware";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getHomeCategories,
  getSubCategories,
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

router.delete("/delete/:categoryId", authenticate(["admin"]), deleteCategory);

// get all main categories
router.get("/get-categories", getCategories);

router.get("/get-home-categories", getHomeCategories);

// get category by id
router.get(
  "/get-category/:categoryId",
  authenticate(["admin"]),
  getCategoryById,
);

// get all sub categories
router.get("/get-sub-categories/:categoryId", getSubCategories);

export default router;
