import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../style_2.css";
import { Deco } from "../components/jsx_deco_.js";

function OAuthCallback() {
    const styles = Deco.OAuthCallback;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const [error, setError] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setError(true);
            setTimeout(() => navigate("/sign-in"), 2000);
            return;
        }

        async function setToken() {
            try {
                await axios.post(`${backendUrl}/api/auth/set-token`, { token }, { withCredentials: true });
                navigate("/home", { replace: true });
            } catch (err) {
                console.error("Failed to set auth token:", err);
                setError(true);
                setTimeout(() => navigate("/sign-in"), 2000);
            }
        }

        setToken();
    }, [searchParams, navigate, backendUrl]);

    if (error) {
        return (
            <div className={styles.Wrapper}>
                <div className={styles.ErrorText}>
                    Authentication failed. Redirecting to sign in...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.Wrapper}>
            <div className={styles.Text}>
                Authenticating...
            </div>
        </div>
    );
}

export default OAuthCallback;
