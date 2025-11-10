import { apiSlice } from "./apiSlice";
import { USER_URL } from "../features/constant";
import { data } from "react-router";


export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query:data=>({
        url:`${USER_URL}`,
        method:"POST",
        body : data,
      })
    }),

    // profile 

    profile:builder.mutation({
      query:data=>({
        url:`${USER_URL}/profile`,
        method:'PUT',
        body:data,
      })
    }),

    getUsers: builder.query({  
    query: () => ({
        url: `${USER_URL}`,
    }),  // ✅ Added comma here
    providesTags: ['User'],
    keepUnusedDataFor: 5,
}),

// delete users 

  deleteUsers: builder.mutation({
    query:(userId)=>({
      url:`${USER_URL}/${userId}`,
      method:'DELETE',
    })
  }),

  // getuserDetails

  getuserDetais:builder.query({
    query:(id)=>({
      url:`${USER_URL}/${id}`,
      keepUnusedDataFor: 5,
    })
  }),

  // updateuser 

 updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/${data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),

  



});

export const { useLoginMutation,
   useLogoutMutation,
   useRegisterMutation,
   useProfileMutation,
  useGetUsersQuery,
  useDeleteUsersMutation,
  useGetuserDetaisQuery,
  useUpdateUserMutation } 
  = userApiSlice;
