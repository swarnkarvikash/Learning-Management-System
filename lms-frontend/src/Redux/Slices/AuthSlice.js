import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance  from '../../Helpers/axiosInstance';

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data: localStorage.getItem('data') || {}
};


export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const response = await axiosInstance.post("user/register", data);
        toast.promise(response, {
            loading: 'Wait! creating your account',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to create your account'
        });
        return response.data;
    } catch(error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
})

export const login = createAsyncThunk("/auth/signin", async (data) => {
    try {
        const response = axiosInstance.post("user/login", data);
        toast.promise(response, {
            loading: 'Wait! authenticating your account',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to authenticate your account'
        });
        return await response.data;
    } catch(error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
})


export const logout = createAsyncThunk("/auth/logout", async() => {
    try{
        const response = axiosInstance.post("user/logout");
        toast.promise(response, {
            loading: 'Wait! logout in progress...',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed log out your account'
        });
        return await response.data;
    }catch(error){
        toast.error(error?.response?.data?.message);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            localStorage.setItem("data", JSON.stringify(action?.payload?.user));
            localStorage.setItem("isLoggedin", true);
            localStorage.setItem("role", action?.payload?.user?.role);
            state.isLoggedIn = true;
            state.data = action?.payload?.user;
            state.role = action?.payload?.user?.role;
        })
        .addCase(logout.fulfilled, (state) => {
            localStorage.clear();
            state.data = {},
            state.isLoggedIn = false;
            state.role = "";
        })
    }
});

//export const {} =authSlice.actions;
export default authSlice.reducer;