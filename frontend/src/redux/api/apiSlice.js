import {fetchBaseQuery,createApi} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../features/constant";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include"
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes:["Products", "Order","User","Category"],
    endpoints:()=>({}),
})