import React from "react"
import Link from "next/link"
import styles from "../styles/Home.module.scss"

function Navbar() {
    return (
        <React.Fragment>
            <div className={styles.navbar}>
                <Link href="/register"><a>Register</a></Link>
                <Link href="/login"><a>Login</a></Link>
                <Link href="/logout"><a>Logout</a></Link>
            </div>
        </React.Fragment>
    )
}

export default Navbar