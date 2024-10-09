import { Router } from "express";
import { createSale, getSales } from "../controllers/saleController";

const router = Router();
router.get("/", getSales);
router.post("/", createSale);
export default router;