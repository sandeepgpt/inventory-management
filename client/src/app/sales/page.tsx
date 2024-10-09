'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  useGetProductsQuery,
  useGetSalesQuery,
  useCreateSaleMutation,
} from "@/state/api";
import { v4 as uuidv4 } from 'uuid';

const CreateSale = () => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch product data for the dropdown
  const { data: products = [], error: productError } = useGetProductsQuery();

  // Fetch sales data to display on the same page
  const { data: sales = [], error: salesError, refetch: refetchSales } = useGetSalesQuery();

  // Create sale mutation
  const [createSale] = useCreateSaleMutation();

  // Calculate total amount whenever quantity or unit price changes
  useEffect(() => {
    setTotalAmount(quantity * unitPrice);
  }, [quantity, unitPrice]);

  // Submit sale data
  // const handleSubmit = async (e: ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   if (!selectedProductId || quantity <= 0 || unitPrice <= 0 || !location.trim()) {
  //     alert("Please fill out all fields correctly.");
  //     return;
  //   }
    
  //   const saleData = {
  //     saleId: uuidv4(),
  //     productId: selectedProductId,
  //     timestamp: new Date().toISOString(),
  //     quantity,
  //     unitPrice,
  //     totalAmount,
  //     location,
  //   };

  //   try {
  //     await createSale(saleData).unwrap(); // Use `unwrap()` to handle the result or error
  //     alert('Sale created successfully!');
  //     refetchSales(); // Refetch sales data after submission
  //     resetForm();
  //   } catch (error) {
  //     console.error('Error creating sale', error);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0 || unitPrice <= 0 || !location.trim()) {
      alert("Please fill out all fields correctly.");
      return;
    }
  
    const saleData = {
      saleId: uuidv4(),
      productId: selectedProductId,
      timestamp: new Date().toISOString(),
      quantity,
      unitPrice,
      totalAmount,
      location,
    };
  
    try {
      await createSale(saleData).unwrap(); // Use `unwrap()` to handle the result or error
      alert('Sale created successfully!');
      refetchSales(); // Refetch sales data after submission
      resetForm();
    } catch (error) {
      console.error('Error creating sale', error);
    }
  };
  

  // Reset form fields after submission
  const resetForm = () => {
    setSelectedProductId('');
    setQuantity(0);
    setUnitPrice(0);
    setLocation('');
    setTotalAmount(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">Create Sale</h1>

      {productError && <p className="text-red-500">Error fetching products</p>}
      {salesError && <p className="text-red-500">Error fetching sales</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="product" className="block text-lg font-medium text-gray-700">
            Select Product:
          </label>
          <select
            id="product"
            className="block w-full mt-2 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">--Select a Product--</option>
            {products.map((product) => (
              <option key={product.productId} value={product.productId}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-lg font-medium text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              className="block w-full mt-2 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter quantity"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="unitPrice" className="block text-lg font-medium text-gray-700">
              Unit Price ($):
            </label>
            <input
              type="number"
              id="unitPrice"
              className="block w-full mt-2 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter unit price"
              min="0"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label htmlFor="totalAmount" className="block text-lg font-medium text-gray-700">
            Total Amount ($):
          </label>
          <input
            type="number"
            id="totalAmount"
            className="block w-full mt-2 border border-gray-300 p-2 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none"
            placeholder="Total amount"
            value={totalAmount.toFixed(2)}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-lg font-medium text-gray-700">
            Location:
          </label>
          <input
            type="text"
            id="location"
            className="block w-full mt-2 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        >
          Create Sale
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Sales List</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sales.map((sale) => (
            <li
              key={sale.saleId}
              className="p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-lg font-semibold text-blue-600">{sale.product ? sale.product.name : 'Unknown Product'}</div>
              <div className="mt-2">
                <strong>Quantity:</strong> {sale.quantity}
              </div>
              <div>
                <strong>Total Amount:</strong> ${sale.totalAmount.toFixed(2)}
              </div>
              <div>
                <strong>Location:</strong> {sale.location}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateSale;

