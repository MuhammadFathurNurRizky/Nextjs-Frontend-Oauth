import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios"
import { isJwtExpired, makeUrl } from "../../../components/utils"

export const refreshToken = async function (refreshToken) {
    try {
        const response = await axios.post(
            "http://localhost:8000/social_auth/google/",
            makeUrl(
                process.env.SOCIAL_SECRET,
                "auth",
                "token",
                "refresh",
            ),
            {
                refresh: refreshToken
            },
        )
        const { access, refresh } = response.data
        return [access, refresh]
    } catch {
        return [null, null]
    }
}

export default NextAuth({
    secret: process.env.SESSION_SECRET,
    session: {
        jwt: true,
        maxAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    debug: process.env.NODE_ENV === "development",
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
            // user signed in
            if (user) {
                // may have to switch it up a bit for other provider
                if (account.provider === "google") {
                    // extract these two tokens
                    const { accessToken, idToken } = account

                    // Make a POST request to the DRF backend
                    try {
                        const response = await axios.post(
                            // tip: use a seperate .ts file or json file to store such URL endpoints
                            // "http://127.0.0.1:8000/api/social/login/google/",
                            makeUrl(
                                process.env.BACKEND_API_BASE,
                                "sosial",
                                "login",
                                account.provider,
                            ),
                            {
                                access_token: accessToken,
                                id_token: idToken,
                            },
                        );
                        // extract the returned token from the DRF backend and add it to the `user` object
                        const { access_token, refresh_token } = response.data
                        // reform the `token` object from the access token we appended to the `user` object
                        token = {
                            ...token,
                            accessToken: access_token,
                            refreshToken: refresh_token
                        };
                        return token
                    } catch (error) {
                        return null
                    }
                }
            }

            if (isJwtExpired(token.accessToken)) {
                const [newAccessToken, newRefreshToken] = await NextAuth.refresh_token(token.refreshToken)

                if (newAccessToken && newRefreshToken) {
                    token = {
                        ...token,
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000 + 2 * 60 * 60),
                    }
                    return token
                }
                return {
                    ...token,
                    exp: 0,
                };
            }
            // token valid
            return token
        },

        async session(session, userOrToken) {
            session.accessToken = userOrToken.accessToken
            return session
        },
    },
})