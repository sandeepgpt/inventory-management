import { Router } from "express";
import { createProduct, getProducts, updateProductStockQuantity, deleteProduct } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
// new created for delete and update
router.patch("/:productId/stockQuantity", updateProductStockQuantity);
//router.patch("/:taskId/status", updateTaskStatus);
//router.patch("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);
export default router;
