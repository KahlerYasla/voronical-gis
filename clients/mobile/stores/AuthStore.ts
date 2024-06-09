import { API_BASE_URL } from "@/constants/Strings";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

export interface AuthCredentials {
    userId: number,
    userName: string,
    userRole: string
}

export interface AuthStore {
    credentials: AuthCredentials | null;
    login: (username: string, password: string, userRole: string) => Promise<boolean>;
    register: (username: string, password: string, userRole: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    credentials: null,

    login: async (userName, password, userRole) => {
        const url = `${API_BASE_URL}/auth/login`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const requestData = {
            userName,
            userRole,
            password
        };

        try {
            const response = await axios.post<AuthCredentials>(url, requestData, { headers });

            console.log("API auth/login response:", response.data);

            if (response.data.userId == null) {
                console.error("Invalid credentials");
                return false;
            }

            set({ credentials: response.data });
            return true;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error(axiosError.message);
            console.error(axiosError.response?.data);
            console.error(axiosError.response?.status);
            return false;
        }
    },

    register: async (userName, password, userRole) => {
        const url = `${API_BASE_URL}/auth/create`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        const requestData = {
            userName,
            userRole,
            password
        };

        try {
            const response = await axios.post<AuthCredentials>(url, requestData, { headers });

            set({ credentials: response.data });
            return true;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error(axiosError.message);
            console.error(axiosError.response?.data);
            console.error(axiosError.response?.status);
            return false;
        }
    },

    logout: () => {
        set({ credentials: null });
    }
}));