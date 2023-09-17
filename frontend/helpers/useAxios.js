import axios from "axios";

function useAxios({
    baseURL = process.env.NEXT_PUBLIC_API_URL,
    timeout = 5000,
    maxRetries = 3,
    ...config
} = {}) {
    const instance = axios.create({
        ...config,
        baseURL,
        timeout,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    })

    return async (request) => {
        const payload = { url: request.path, ...request, };
        const { data } = await requester(payload, instance);

        return data;
    }
}

function requester(request, axios) {
    let retryCount = 0;

    return send();

    async function send() {
        try {
            return await axios(request)
        } catch (err) {
            if (err.code === "ECONNABORTED") {
                retryCount++;
                send();
            }

            if (err.response) {
                throw err.response.data;
            }

            if (err.request) {
                throw {
                    ...err.request,
                    message: "Unable to connect to the server"
                };
            }

            throw {
                message: "An unexpected error occurred"
            };
        }
    }
}

export default useAxios

// import axios from "axios";

// function useAxios(config) {
//     const { send } = new Eduxios(config);
//     return send;
// }

// export default useAxios

// class Eduxios {
//     constructor({
//         baseURL = process.env.NEXT_PUBLIC_API_URL,
//         timeout = 5000,
//         maxRetries,
//         ...config
//     } = {}) {
//         this.fetch = axios.create({
//             ...config,
//             baseURL,
//             timeout,
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });

//         this.fetch = null;
//         this.previousRequest = null;
//         this.maxRetries = maxRetries;
//         this.retries = 0;

//         this.response = null;
//         this.error = null;
//     }

//     async retry() {
//         if (this.retries < this.maxRetries) return;

//         this.retries++;
//         return this.send(this.previousRequest)
//     }

//     async send(request) {
//         try {
//             this.previousRequest = request;
//             this.response = await this.fetch(request);
//         } catch (err) {
//             console.error(err);
//             if (err.code === "ECONNABORTED") {
//                 this.retry()
//             }

//             if (err.response) {
//                 this.error = err.response.data;
//             }

//             if (err.request) {
//                 this.error = {
//                     ...err.request,
//                     message: "Unable to connect to the server"
//                 };
//             }

//             this.error = "An unexpected error occurred";
//         } finally {
//             return [this.response, this.error]
//         }
//     }
// }