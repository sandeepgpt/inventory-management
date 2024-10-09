import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type ProductFormData = {
  productId?: string;
  stockQuantity: number;
};

type UpdateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (productId: string, stockQuantity: number) => void; // Update function signature to match only stockQuantity
  product: ProductFormData | null;
};

const UpdateProductModal = ({
  isOpen,
  onClose,
  onUpdate,
  product,
}: UpdateProductModalProps) => {
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    productId: "",
    stockQuantity: 0,
  });

  useEffect(() => {
    if (product) {
      setProductFormData({
        productId: product.productId || "",
        stockQuantity: product.stockQuantity || 0,
      });
    }
  }, [product]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: name === "stockQuantity" ? parseInt(value) : 0,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Extract productId and stockQuantity to send to the backend
    const { productId, stockQuantity } = productFormData;

    if (productId) {
      onUpdate(productId, stockQuantity);  // Send productId and stockQuantity
    }

    onClose();  // Close the modal after submission
  };

  if (!isOpen || !product) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Update Stock Quantity" />
        <form onSubmit={handleSubmit} className="mt-5">
          <input type="hidden" name="productId" value={productFormData.productId} />

          <label htmlFor="stockQuantity" className={labelCssStyles}>Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={productFormData.stockQuantity}
            className={inputCssStyles}
            required
          />

          <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Update
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;






