import express, { Router } from "express";
import {
  createStore,
  updateStore,
} from "../controllers/store/store-owner.controller";
import { authenticate } from "../middleware/authenticate.middleware";
import { getNearbyStore } from "../controllers/store/store-public.controller";

const router: Router = express.Router();

// ----------------- Store owner routes--------------------------------------

// Create new Store
router.post("/create", authenticate([]), createStore);

router.patch("/update/:storeId", authenticate(["store_manager"]), updateStore);

// ----------------- Public Store routes--------------------------------------

router.get("/nearby", getNearbyStore);

export default router;
