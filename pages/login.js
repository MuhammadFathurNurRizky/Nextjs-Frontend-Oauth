import React, { useState } from "react"
import Head from "next/head"
//import axiosInstance from "../components/axios"
import { useRouter } from "next/router"
import styles from "../styles/Register.module.scss"
import Link from "next/link"
import axios from "axios"

function Login() {
    const router = useRouter()

    const initialFormDate = Object.freeze({
        email: "",
        password: "",
    })

    const [formData, updateFormData] = useState(initialFormDate)

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            //Triming any whitespace
            [e.target.name]: e.target.value.trim()
        })
    }

    const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(formData);

		await axios({
            method: "POST",
            url: "http://localhost:8000/token/",
            timeout: 5000,
            headers: {
                Authorization: localStorage.getItem("access_token")
                ? 'JWT ' + localStorage.getItem("access_token")
                : null,
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            data: {
                email: formData.email,
                password: formData.password,
            },
        })
		.then((res) => {
			localStorage.setItem("access_token", res.data.access);
			localStorage.setItem("refresh_token", res.data.refresh);
			router.push('/');
			// axiosInstance.defaults.headers["Authorization"] =
			// 	'JWT ' + localStorage.getItem("access_token");
			console.log(res);
			console.log(res.data);
		})
        .catch((error) => {
            if (error) {
                console.log(error)
                setError(error.response.status)
            } else {
                
            }
        })
	};
    const [error, setError] = useState()
    return (
        <React.Fragment>
            <Head>
                <meta name="description" content="This is for user login" />
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <h1>Login</h1>
                {error ? <p style={{color: "red"}}>{error}</p> : null}
                <form className={styles.form}>
                    <label>Email Address</label>
                    <input type="email" name="email" autoComplete="email" required onChange={handleChange} />
                    <label>Password</label>
                    <input type="password" name="password" autoComplete="current-password" required onChange={handleChange} />
                    <button className={styles.button} type="submit" onClick={handleSubmit}>Register</button>
                </form>
                <p>Jika anda belum mendaftar</p> <Link href="/register"><a className={styles.link}>klik di sini</a></Link>
            </div>
        </React.Fragment>
    )
}

export default Login