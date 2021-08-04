import React, { useState } from "react"
import Head from "next/head"
import { useRouter } from 'next/router'
import styles from "../styles/Register.module.scss"
import Link from "next/link"
import axios from "axios"

function Register() {
    const router = useRouter()

    const initialFormData = Object.freeze({
        email: "",
        username: "",
        password: "",
    })

    const [formData, updateFormData] = useState(initialFormData)

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            // Triming any whitespace
            [e.target.name]: e.target.value.trim(),
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)

        axios({
            method: "POST",
            url: "http://localhost:8000/auth/",
            timeout: 5000,
            data: {
                email: formData.email,
                user_name: formData.username,
                password: formData.password
            },
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        })
        .then((res) => {
            router.push("/login")
            console.log(res)
            console.log(res.data)
        })
        .catch((error) => {
            setError(error.response.status)
            console.log(error.response)
        })
    }
    const [error, setError] = useState()
    return (
        <React.Fragment>
            <Head>
                <meta name="description" content="This is for user register" />
                <title>Register</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <h1>Register</h1>
                <p style={{color: "red"}}>{error}</p>
                <form className={styles.form}>
                    <label>Email Address</label>
                    <input type="email" name="email" autoComplete="email" required onChange={handleChange} />
                    <label>User Name</label>
                    <input type="text" name="username" autoComplete="username" required onChange={handleChange} />
                    <label>Password</label>
                    <input type="password" name="password" autoComplete="current-password" required onChange={handleChange} />
                    <button className={styles.button} type="submit" onClick={handleSubmit}>Register</button>
                </form>
                <p>Jika anda telah mempunyai akun silahkan login</p> <Link href="/login"><a className={styles.link}>klik di sini</a></Link>
            </div>
        </React.Fragment>
    )
}

export default Register