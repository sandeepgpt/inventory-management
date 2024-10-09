"use client";

import {
  useCreateProductMutation,
  useGetProductsQuery,
  useUpdateProductStockQuantityMutation,
  useDeleteProductMutation,
} from "@/state/api";
import { Product } from "@/state/api";
import { PencilIcon, PlusCircleIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";
import Image from "next/image";

type ProductFormData = {
  productId?: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductFormData | null>(null);

  const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const [updateProductStockQuantity] = useUpdateProductStockQuantityMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
    setIsCreateModalOpen(false); // Close modal after creation
  };

  // const handleUpdateProduct = async (product: ProductFormData) => {
  //   setSelectedProduct(product);
  //   setIsUpdateModalOpen(true); // Open the modal for editing
  // };

  const handleUpdateProduct = (product: Product) => {
    // Create a new object that conforms to ProductFormData
    const productData: ProductFormData = {
      productId: product.productId,
      name: product.name,
      price: product.price,
      stockQuantity: product.stockQuantity,
      rating: product.rating ?? 0, // Default to 0 if undefined
    };
  
    setSelectedProduct(productData);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    // Alert confirmation before deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        await deleteProduct(productId);
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handleSubmitUpdate = async (productId: string, stockQuantity: number) => {
    try {
      await updateProductStockQuantity({
        productId,
        stockQuantity,
      });
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating stock quantity:", error);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between gap-2 items-center mb-6">
        <Header name="Products" />
        <div className="flex gap-2">
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create Product
          </button>
        </div>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {products?.map((product) => (
          <div
            key={product.productId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
            // onClick={() => setSelectedProduct(product)}
            onClick={() =>
              setSelectedProduct({
                productId: product.productId,
                name: product.name,
                price: product.price,
                stockQuantity: product.stockQuantity,
                rating: product.rating ?? 0, // Default to 0 if undefined
              })
            }
            
          >
            <div className="flex flex-col items-center">
              {/* Product Image */}
              {/* Uncomment below for image handling */}
              {/* <Image
                src={`https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/product${Math.floor(Math.random() * 3) + 1}.png`}
                alt={product.name}
                width={150}
                height={150}
                className="mb-3 rounded-2xl w-36 h-36"
              /> */}
              <h3 className="text-lg text-gray-900 font-semibold">{product.name}</h3>
              <p className="text-gray-800">${product.price.toFixed(2)}</p>
              <div className="text-sm text-gray-600 mt-1">Stock: {product.stockQuantity}</div>
              {product.rating && (
                <div className="flex items-center mt-2">
                  <Rating rating={product.rating ?? 0} />
                </div>
              )}
              <div className="flex gap-2 mt-2">
                {/* Update Button */}
                <button
                   className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
                   title="Update Product"
                   onClick={() => handleUpdateProduct(product)}
                >
                    <PencilIcon className="w-5 h-5 mr-2 text-white" />
                    <span className="hidden sm:inline">Update</span>
                </button>

                {/* Delete Button */}
                <button
                   className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
                   title="Delete Product"
                   onClick={() => handleDeleteProduct(product.productId)}
                >
                   <TrashIcon className="w-5 h-5 mr-2 text-white" />
                   <span className="hidden sm:inline">Delete</span>
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProduct}
      />

      {/* UPDATE MODAL */}
      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleSubmitUpdate}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
