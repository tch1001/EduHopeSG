import { useEffect, useState } from "react";
import useAxios from "./useAxios";

function useUser() {
    const requester = useAxios();
    const [user, setUser] = useState({ id: null, name: null, is_tutor: null });

    useEffect(() => {
        setUser({
            id: localStorage.getItem("user_id"),
            name: localStorage.getItem("username"),
            is_tutor: localStorage.getItem("is_tutor") === "true"
        });
    }, [])

    const methods = {
        logout,
        login,
    }

    return [user, methods];

    async function logout() {
        try {
            const request = {
                method: "get",
                path: "/user/logout"
            };

            const response = await requester(request);
            localStorage.removeItem("user_id");
            localStorage.removeItem("given_name");
            localStorage.removeItem("family_name");            
            localStorage.removeItem("is_tutor");

            return response;
        } catch (err) {
            throw "Failed to logout";
        }
    }

    async function login({ email, password }) {
        if (!email || !password) throw "Missing required arguments";

        try {
            const request = {
                method: "post",
                path: "/user/login",
                data: { email, password }
            };

            const response = await requester(request);
            if (!response?.id) throw "Failed to login";

            localStorage.setItem("user_id", response.id);
            localStorage.setItem("given_name", response.given_name);
            localStorage.setItem("family_name", response.family_name);
            localStorage.setItem("is_tutor", response.is_tutor);

            return response;
        } catch (err) {
            throw err;
        }
    }
}

export default useUser;
