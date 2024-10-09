import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
}

export interface Sale {
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  timestamp: string;
  location: string;
  product?: Product;
}

export interface NewSale {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  timestamp: string;
  location: string;
}

export interface Purchase {
  purchaseId: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  timestamp: string;
  location: string;
  product?: Product;
}


export interface NewPurchase {
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  timestamp: string;
  location: string;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}
export interface NewUser {
  userId: string;
  name: string;
  email: string;
}


export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses", "Sales", "Purchases"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),

    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    getSales: build.query<Sale[], void>({
      query: () => "/sales",
      providesTags: ["Sales"],
    }),
    createSale: build.mutation<Sale, NewSale>({
      query: (newSale) => ({
        url: "/sales",
        method: "POST",
        body: newSale,
      }),
      invalidatesTags: ["Sales"],
    }),

    getPurchases: build.query<Purchase[], void>({
      query: () => "/purchases",
      providesTags: ["Purchases"],
    }),
    createPurchase: build.mutation<Purchase, NewPurchase>({
      query: (newPurchase) => ({
        url: "/Purchases",
        method: "POST",
        body: newPurchase,
      }),
      invalidatesTags: ["Purchases"],
    }),

    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createUser: build.mutation<User, NewUser>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),



    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),


    updateProductStockQuantity: build.mutation<Product, { productId: string; stockQuantity: number }>({
      query: ({ productId, stockQuantity }) => ({
        url: `products/${productId}/stockQuantity`,
        method: "PATCH",
        body: { stockQuantity },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Products", productId: productId },
      ],
    }),

    // model Task {
    //   id             Int       @id @default(autoincrement())
    //   title          String
    //   description    String?
    //   status         String?

    // updateProduct: build.mutation<Product, { productId: string; data: Partial<NewProduct> }>({
    //   query: ({ productId, data }) => ({
    //     url: `/products/${productId}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["Products"],
    // }),
     
    deleteProduct: build.mutation<void, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});



export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductStockQuantityMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useGetSalesQuery,
  useCreateSaleMutation,
  useGetPurchasesQuery,
  useCreatePurchaseMutation,
  useGetExpensesByCategoryQuery,
} = api;

