import express, { type Router } from "express";
import { healthCheck } from "../controllers/health.controller";

const router: Router = express.Router();

router.get("/", healthCheck);

export default router;
