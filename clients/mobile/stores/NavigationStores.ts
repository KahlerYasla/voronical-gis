import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants/Strings';

export interface LineString {
    coordinates: number[][];
}

interface NavigationRequest {
    start: string;
    end: string;
}

export interface NavigationStore {
    lineString: LineString;
    navigateToMarket: (from: NavigationRequest) => Promise<LineString>;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
    lineString: { coordinates: [] },

    navigateToMarket: async (req: NavigationRequest) => {
        console.log("req: ", req);

        const url = `${API_BASE_URL}/navigation/shortest-path`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const requestData = {
            "from": req.start,
            "to": req.end
        };

        try {
            const response = await axios.post(url, requestData, { headers });

            console.log("API Response:", response.data);

            if (Array.isArray(response.data)) {
                const coordinates = response.data.map((point: { latitude: number; longitude: number }) => [point.latitude, point.longitude]);
                const lineString: LineString = { coordinates };

                set({ lineString });

                console.log("LineString:", lineString);
                return lineString;
            } else {
                console.error("Invalid response structure:", response.data);
                return { coordinates: [] };
            }

        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Axios Error:", axiosError.message);
            console.error("Response Data:", axiosError.response?.data);
            console.error("Status Code:", axiosError.response?.status);
            return { coordinates: [] };
        }
    },
}));
