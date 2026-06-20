import express, { type Router } from "express";
import {
  createAddress,
  deleteAddress,
  getUserAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/address.controller";
import { authenticate } from "../middleware/authenticate.middleware";

const router: Router = express.Router();

// Create address route
router.post("/create", authenticate(["customer"]), createAddress);

// get user all addresses
router.get("/get", authenticate(["customer"]), getUserAddresses);

// Update address route
router.patch(
  "/update/:addressId",
  authenticate(["customer", "store_manager"]),
  updateAddress,
);

// Set default address
router.patch(
  "/default/:addressId",
  authenticate(["customer"]),
  setDefaultAddress,
);

router.delete("/delete/:addressId", authenticate(["customer"]), deleteAddress);

export default router;
