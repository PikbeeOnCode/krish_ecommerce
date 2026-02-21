import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../features/constant";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ search, page, limit } = {}) => ({
                url: `${PRODUCT_URL}`,
                params: { search, page, limit },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Products'],
        }),

        getProductsByID: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
            }),
            providesTags: (result, error, productId) => [
                { type: 'Products', id: productId }
            ],
            keepUnusedDataFor: 0,
        }),

        allProducts: builder.query({
            query: () => `${PRODUCT_URL}/allProducts`,
            providesTags: ['Products'],
        }),

        getProductsDetail: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
            }),
            providesTags: (result, error, productId) => [
                { type: 'Products', id: productId }
            ],
        }),

        createProduct: builder.mutation({
            query: (productData) => ({
                url: `${PRODUCT_URL}`,
                method: 'POST',
                body: productData,
            }),
            invalidatesTags: ['Products'],
        }),

        updateProduct: builder.mutation({
            query: ({ productId, formData }) => ({
                url: `${PRODUCT_URL}/${productId}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: 'Products', id: productId },
                'Products',
            ],
        }),

        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data,
            }),
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),

        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCT_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: 'Products', id: productId },
            ],
        }),

        getTopProducts: builder.query({
            query: () => `${PRODUCT_URL}/top`,
            keepUnusedDataFor: 5,
            providesTags: ['Products'],
        }),

        getnewCategories: builder.query({
            query: () => `${PRODUCT_URL}/new`,
            keepUnusedDataFor: 5,
            providesTags: ['Products'],
        }),

        getFilteredProducts: builder.query({
            query: ({ checked, radio }) => ({
                url: `${PRODUCT_URL}/filtered-products`,
                method: "POST",
                body: { checked, radio },
            }),
            providesTags: ['Products'],
        }),
    })
})

export const {
    useGetProductsQuery,
    useAllProductsQuery,
    useCreateProductMutation,
    useGetProductsByIDQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery,
    useGetnewCategoriesQuery,
    useGetProductsDetailQuery,
    useUploadProductImageMutation,
    useGetFilteredProductsQuery,
} = productApiSlice