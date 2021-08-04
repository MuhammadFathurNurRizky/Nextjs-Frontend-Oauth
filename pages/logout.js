import React, { useEffect } from 'react'
import { useRouter } from "next/router"
//import axiosInstance from "../components/axios"
import axios from "axios"

function Logout() {
    const router = useRouter()

    useEffect(() => {
        axios({
            method: "POST",
            url: "http://localhost:8000/auth/logout/blacklist/",
            refresh_token: localStorage.getItem("refresh_token"),
            timeout: 5000,
        })
        .then(() => {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            router.push("/login")
        })
        .catch((error) => {
            console.log(error)
        })
        // axiosInstance.defaults.headers["Authorization"] = null
    }, [])
    return <div>Logout</div>
}

export default Logout