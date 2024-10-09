import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        name: 'asc', // Change 'name' to 'price' or any other field if needed
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId } = req.params;
  try {
    // Check for related records and delete if necessary
    await prisma.sales.deleteMany({ where: { productId } });
    await prisma.purchases.deleteMany({ where: { productId } });

    // Delete the product itself
    await prisma.products.delete({
      where: { productId },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const updateProductStockQuantity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId } = req.params;
  const { stockQuantity } = req.body;
  try {
    const updatedStockQuantity = await prisma.products.update({
      where: {
        productId: String(productId),
      },
      data: {
        stockQuantity: stockQuantity,
      },
    });
    res.json(updatedStockQuantity);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating task: ${error.message}` });
  }
};

// export const updateProduct = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { productId } = req.params; // Check this value
//   const { name, price, rating, stockQuantity } = req.body;
 
//   try {
//     console.log("Updating Product with ID:", productId); // Debugging log
//     console.log("Received Data:", req.body); // Debugging log
//        // Update the product
//     const updatedProduct = await prisma.products.update({
//       where: { productId: String(productId) },
//       data: { name, price, rating, stockQuantity },
      
//     });

//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ message: "Error updating product" });
//   }
// };



