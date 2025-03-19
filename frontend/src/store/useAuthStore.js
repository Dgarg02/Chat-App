import { create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { data } from "react-router-dom";


export const useAuthStore = create((set)=>({
    authUser:null,
    isSigingUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,

    checkAuth:async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
        } catch (error) {
            console.log("Error in checkAuth:",error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup:async(data)=>{
        set({isSigingUp:true})
        try {
            const res =await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in signupAuth:", error)
        }finally{
            set({isSigingUp:false})
        }
    },

    login:async(data)=>{
        set({isLoggingIng:true})
        try {
            const res= await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            toast.success("Logged in successfully")

        } catch (error) {
            toast.error(error.response.data.message)   
        }finally{
            set({isLoggingIng:false})
        }
    },

    logout:async()=>{
        try {
            await axiosInstance.post('/auth/logout')
            set({authUser:null});
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in logoutAuth:", error)
        }
    }
}));