import { useEffect, useState } from "react";
import useAxios from "./useAxios";

function useUser() {
    const requester = useAxios();
    const [user, setUser] = useState({ id: null, name: null, is_tutor: null });

    useEffect(() => {
        setUser({
            id: localStorage.getItem("user_id"),
            name: localStorage.getItem("username"),
            is_tutor: localStorage.getItem("is_tutor")
        })
    }, [])

    const methods = {
        logout,

    }

    return [user, methods];

    async function logout() {
        try {
            const request = {
                method: "get",
                path: "/user/logout"
            };


            await requester(request);
            localStorage.removeItem("user_id");
            localStorage.removeItem("username");
        } catch (err) {
            throw "Failed to logout"
        }
    }
}

export default useUser;