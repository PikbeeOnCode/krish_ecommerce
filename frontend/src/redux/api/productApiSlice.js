import { apiSlice } from "./apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../features/constant";
import { data } from "react-router";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ filter }) => ({
                url: `${PRODUCT_URL}`,
                params: { filter, },
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Products'],
        }),
        getProductsByID: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,

            }),
            providesTags: (result, Error, productId) => [{ type: 'Products', id: productId }],

        }),

        allProducts: builder.query({
            query: () => `${PRODUCT_URL}/allProducts`,
        }),

        getProductsDetail: builder.query({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
            })
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
            })
        }),

        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: 'POST',
                body: data,
            })
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCT_URL}/${productId}`,
                method: 'DELETE',
            }),
            providesTags: ['Products'],
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCT_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data,
            })
        }),

        getTopProducts: builder.query({
            query: () => `${PRODUCT_URL}/top`,
            keepUnusedDataFor: 5,
        }),

        getnewCategories: builder.query({
            query: () => `${PRODUCT_URL}/new`,
            keepUnusedDataFor: 5,
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
    useUploadProductImageMutation
} = productApiSlice