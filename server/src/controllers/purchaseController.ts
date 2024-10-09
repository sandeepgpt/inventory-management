import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getPurchases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const purchases = await prisma.purchases.findMany({
        include: {
            product: true,  // Include product details for each sale
          },
    });
    res.json(purchases);
    
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createPurchase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {purchaseId, productId, timestamp, quantity, unitCost, totalCost, location } = req.body;
    const purchase = await prisma.purchases.create({
      data: {
        purchaseId,
        productId,
        timestamp: new Date(timestamp),
        quantity,
        unitCost,
        totalCost,
        location,
      },
    });
    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};






