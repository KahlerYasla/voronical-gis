import { API_BASE_URL } from "@/constants/Strings";
import axios, { AxiosError } from "axios";
import { create } from "zustand";

export interface AuthCredentials {
    userId: number,
    userName: string,
    userRole: string
}

