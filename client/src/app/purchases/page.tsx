'use client';
import { useState, useEffect } from 'react';
import React from 'react';
import {
  useGetProductsQuery,
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
} from "@/state/api";
import { v4 as uuidv4 } from 'uuid';


const CreatePurchase = () => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitCost, setUnitCost] = useState(0);
  const [location, setLocation] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  
  // Fetch product data for the dropdown
  const { data: products = [], error: productError } = useGetProductsQuery();

  // Fetch sales data to display on the same page
  const { data: purchases = [], error: purchasesError, refetch: refetchPurchases } = useGetPurchasesQuery();

  // Create sale mutation
  const [createPurchase] = useCreatePurchaseMutation();

  // Calculate total amount whenever quantity or unit price changes
  useEffect(() => {
    setTotalCost(quantity * unitCost);
  }, [quantity, unitCost]);

  // Submit sale data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0 || unitCost <= 0 || !location.trim()) {
      alert("Please fill out all fields correctly.");
      return;
    }
    
    const purchaseData = {
      purchaseId: uuidv4(),
      productId: selectedProductId,
      timestamp: new Date().toISOString(),
      quantity,
      unitCost,
      totalCost,
      location,
    };

    try {
      await createPurchase(purchaseData).unwrap(); // Use `unwrap()` to handle the result or error
      alert('Purchase created successfully!');
      refetchPurchases(); // Refetch sales data after submission
      resetForm();
    } catch (error) {
      console.error('Error creating purchase', error);
    }
  };

  // Reset form fields after submission
  const resetForm = () => {
    setSelectedProductId('');
    setQuantity(0);
    setUnitCost(0);
    setLocation('');
    setTotalCost(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">Create Purchase</h1>

      {productError && <p className="text-red-500">Error fetching products</p>}
      {purchasesError && <p className="text-red-500">Error fetching sales</p>}

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
              Unit Cost ($):
            </label>
            <input
              type="number"
              id="unitPrice"
              className="block w-full mt-2 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter unit price"
              min="0"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label htmlFor="totalAmount" className="block text-lg font-medium text-gray-700">
            Total Cost ($):
          </label>
          <input
            type="number"
            id="totalCost"
            className="block w-full mt-2 border border-gray-300 p-2 rounded-md bg-gray-100 cursor-not-allowed focus:outline-none"
            placeholder="Total Cost"
            value={totalCost.toFixed(2)}
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
          Create Purchase
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Purchases List</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {purchases.map((purchase) => (
            <li
              key={purchase.purchaseId}
              className="p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* <div className="text-lg font-semibold text-blue-600">{purchase.product.name}</div> */}
              <div className="text-lg font-semibold text-blue-600">
                 {purchase.product ? purchase.product.name : 'Unknown Product'}
              </div>

              <div className="mt-2">
                <strong>Quantity:</strong> {purchase.quantity}
              </div>
              <div>
                <strong>Total Cost:</strong> ${purchase.totalCost.toFixed(2)}
              </div>
              <div>
                <strong>Location:</strong> {purchase.location}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default CreatePurchase;



