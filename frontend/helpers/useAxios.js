import { useState, useEffect } from "react";
import axios from "axios";

function useAxios({ baseURL = process.env.API_URL, timeout = 5000, maxRetries = 3, ...config }) {
    const baseAxios = axios.create({
        ...config,
        headers: {
            "Content-Type": "application/json"
        },
        baseURL,
        timeout
    });

    return AxiosHook
}


function AxiosHook({ path, method = "get", data = null }) {
    const [isLoading, setIsLoading] = useState(true);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const result = await baseAxios({
                method,
                url: path,
                data,
                timeout,
            });

            setResponse(result.data);
            setIsLoading(false);
        } catch (error) {
            if (error.response) {
                setError(error.response.data);
            } else if (error.request) {
                setError({ message: "Unable to connect to the server" });
            } else if (error.code === "ECONNABORTED" && retryCount < maxRetries) {
                setRetryCount(retryCount + 1);
            } else {
                setError({ message: "An unexpected error occurred" });
            }

            setIsLoading(false);
        }
    };

    useEffect(fetchData, [path, method, data, retryCount]);

    return { response, error, isLoading };
};

export default useAxios;
