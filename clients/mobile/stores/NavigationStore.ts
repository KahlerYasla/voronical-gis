import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants/Strings';

export interface LineString {
    coordinates: number[][];
}

interface NavigationRequest {
    start: string;
    end: string | null;
}

export interface NavigationStore {
    lineString: LineString;
    voronoiPolygon: LineString;

    navigateToMarket: (from: NavigationRequest) => Promise<LineString>;
    navigateToNearestMarket: (from: NavigationRequest) => Promise<LineString>;

    fetchVoronoiPolygon: () => Promise<LineString>;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
    lineString: { coordinates: [] },
    voronoiPolygon: { coordinates: [] },

    navigateToMarket: async (req: NavigationRequest) => {
        console.log("req: ", req);

        const startX = parseFloat(req.start.split(" ")[0]);
        const startY = parseFloat(req.start.split(" ")[1]);

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

                // start point first then rest of the points
                const lineString: LineString = { coordinates: [[startX, startY], ...coordinates] };

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


    navigateToNearestMarket: async (req: NavigationRequest) => {
        console.log("req: ", req);

        const startX = parseFloat(req.start.split(" ")[0]);
        const startY = parseFloat(req.start.split(" ")[1]);

        const url = `${API_BASE_URL}/navigation/nearest-market`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const requestData = {
            "from": req.start
        };

        try {
            const response = await axios.post(url, requestData, { headers });

            console.log("API Response:", response.data);

            if (Array.isArray(response.data)) {
                const coordinates = response.data.map((point: { latitude: number; longitude: number }) => [point.latitude, point.longitude]);

                // start point first then rest of the points
                const lineString: LineString = { coordinates: [[startX, startY], ...coordinates] };

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


    fetchVoronoiPolygon: async () => {
        const url = `${API_BASE_URL}/navigation/voronoi`;
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.get(url, { headers });

            // show first 5 points
            console.log("API Response:", response.data.slice(0, 5), "...");

            if (Array.isArray(response.data)) {
                const coordinates = response.data.map((point: { latitude: number; longitude: number }) => [point.latitude, point.longitude]);

                // start point first then rest of the points
                const lineString: LineString = { coordinates };

                set({ voronoiPolygon: lineString });

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
    }

}
)
);
