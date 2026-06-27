import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Deco } from "../components/jsx_deco_.js";
function Sign_In() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL || "https://localhost:3000";
    useEffect(() => {
        async function checkSession() {
            try {
                const response = await axios.get(`${backend_url}/verify-session`);
                if (response.status === 200) {
                    navigate("/home");
                }
            } catch (error) {
                console.log("Not logged in");
            }
        }
        checkSession();
    }, [navigate, backend_url]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = await axios.post(`${backend_url}/api/login/submit`, {
                email: email,
                password: password
            });
            if (data.status == 200) {
                navigate("/home");
            } else {
                console.log("Sign in failed");
                navigate("/sign-in");
            }
        }
        catch (e) {
            console.log("Sign in failed");
            navigate("/sign-in");
        }
    }
    function handle_Social_login(via) {
        window.location.href = `${backend_url}/auth/${via.toLowerCase()}`;// re direct to social login pages
    }

    return (
        <div className={Deco.SignInPage.Wrapper}>
            <div className={Deco.SignInPage.Card}>
                <div className={Deco.SignInPage.TopAccent}></div>
                <div className={Deco.SignInPage.HeaderContainer}>
                    <h1 className={Deco.SignInPage.Title}>Sign In</h1>
                    <p className={Deco.SignInPage.Subtitle}>Welcome to FairScan</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                    <div className={Deco.SignInPage.Field}>
                        <label htmlFor="email" className={Deco.SignInPage.Label}>Email Address</label>
                        <div className={Deco.SignInPage.InputBox}>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className={Deco.SignInPage.Input}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={Deco.SignInPage.Field}>
                        <label htmlFor="password" className={Deco.SignInPage.Label}>Password</label>
                        <div className={Deco.SignInPage.InputBox}>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className={Deco.SignInPage.Input}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className={Deco.SignInPage.SubmitBtn}>
                        Sign In
                    </button>
                </form>
                <div className={Deco.SignInPage.Divider}>
                    or you can sign in with
                </div>
                <div className={Deco.SignInPage.SocialContainer}>
                    <button onClick={() => handle_Social_login('Google')} className={Deco.SignInPage.SocialBtn}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                        </svg>
                    </button>
                    <button onClick={() => handle_Social_login('Amazon')} className={Deco.SignInPage.SocialBtn}>
                        <svg className="w-5 h-5" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M10.813 11.968c.157.083.36.074.5-.05l.005.005a90 90 0 0 1 1.623-1.405c.173-.143.143-.372.006-.563l-.125-.17c-.345-.465-.673-.906-.673-1.791v-3.3l.001-.335c.008-1.265.014-2.421-.933-3.305C10.404.274 9.06 0 8.03 0 6.017 0 3.77.75 3.296 3.24c-.047.264.143.404.316.443l2.054.22c.19-.009.33-.196.366-.387.176-.857.896-1.271 1.703-1.271.435 0 .929.16 1.188.55.264.39.26.91.257 1.376v.432q-.3.033-.621.065c-1.113.114-2.397.246-3.36.67C3.873 5.91 2.94 7.08 2.94 8.798c0 2.2 1.387 3.298 3.168 3.298 1.506 0 2.328-.354 3.489-1.54l.167.246c.274.405.456.675 1.047 1.166ZM6.03 8.431C6.03 6.627 7.647 6.3 9.177 6.3v.57c.001.776.002 1.434-.396 2.133-.336.595-.87.961-1.465.961-.812 0-1.286-.619-1.286-1.533M.435 12.174c2.629 1.603 6.698 4.084 13.183.997.28-.116.475.078.199.431C13.538 13.96 11.312 16 7.57 16 3.832 16 .968 13.446.094 12.386c-.24-.275.036-.4.199-.299z" />
                            <path fill="currentColor" d="M13.828 11.943c.567-.07 1.468-.027 1.645.204.135.176-.004.966-.233 1.533-.23.563-.572.961-.762 1.115s-.333.094-.23-.137c.105-.23.684-1.663.455-1.963-.213-.278-1.177-.177-1.625-.13l-.09.009q-.142.013-.233.024c-.193.021-.245.027-.274-.032-.074-.209.779-.556 1.347-.623" />
                        </svg>
                    </button>
                    <button onClick={() => handle_Social_login('GitHub')} className={Deco.SignInPage.SocialBtn}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                        </svg>
                    </button>
                </div>
                <div className={Deco.SignInPage.FooterContainer}>
                    <span className={Deco.SignInPage.FooterText}>Don't have an account? </span>
                    <Link to="/sign-up" className={Deco.SignInPage.FooterLink}>Sign up</Link>
                </div>
            </div>
        </div>
    )
}
export default Sign_In;