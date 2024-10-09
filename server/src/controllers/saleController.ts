import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getSales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const sales = await prisma.sales.findMany({
        include: {
            product: true,  // Include product details for each sale
          },
    });
    res.json(sales);
    
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createSale = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {saleId, productId, timestamp, quantity, unitPrice, totalAmount, location } = req.body;
    const sale = await prisma.sales.create({
      data: {
        saleId,
        productId,
        timestamp: new Date(timestamp),
        quantity,
        unitPrice,
        totalAmount,
        location,
      },
    });
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};






