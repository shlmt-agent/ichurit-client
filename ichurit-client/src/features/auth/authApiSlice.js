import apiSlice from "../../app/apiSlice"

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query:(user)=>({
                url:'/api/auth',
                method:'POST',
                body:user
            })
        }),
        logout: build.mutation({
            query: () => ({
                url: '/api/auth',
                method: 'DELETE'
            })
        }),
        createUser: build.mutation({
            query:(user)=>({
                url:'/api/auth/createUser',
                method:'POST',
                body:user
            })
        }),
        changePass: build.mutation({
            query:(pass)=>({
                url:'/api/auth',
                method:'PUT',
                body:pass
            })
        }),
        deleteUser: build.mutation({
            query:(id)=>({
                url:`/api/auth/${id}`,
                method:'DELETE'
            })
        }),
    })
})

export const {useLoginMutation,useLogoutMutation,useCreateUserMutation,useChangePassMutation,useDeleteUserMutation } = authApiSlice

