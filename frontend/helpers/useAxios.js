import { useState } from "react";
import axios from "axios";

function useAxios({
    baseURL = process.env.NEXT_PUBLIC_API_URL,
    timeout = 5000,
    maxRetries = 3,
    ...config
} = {}) {
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const instance = axios.create({
        ...config,
        baseURL,
        timeout,
        headers: {
            "Content-Type": "application/json"
        }
    })

    return async (request) => {
        try {
            const payload = { url: request.path, ...request, };
            const result = await requester(payload, instance);

            setResponse(result);
        } catch (err) {
            setError(err);
        } finally {
            return {
                response,
                error
            }
        }
    }
}

function requester(request, axios) {
    let retryCount = 0;

    return send();

    function send() {
        try {
            return axios(request)
        } catch (error) {
            if (error.response) {
                throw error.response.data;
            } else if (error.request) {
                throw "Unable to connect to the server";
            } else if (error.code === "ECONNABORTED" && retryCount < maxRetries) {
                retryCount++;
                send();
            } else {
                throw "An unexpected error occurred";
            }
        }
    }
}

export default useAxios