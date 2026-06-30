import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Deco } from '../components/jsx_deco_.js';

const customstyle= " bg-surface-container-high! text-on-surface! border border-surface-variant hover:border-[#D4AF37]!";
function Sign_up() {
    const navigate = useNavigate();
    const D = Deco.SignInPage;
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        async function checkSession() {
            try {
                const response = await axios.get(`${backendUrl}/api/auth/verify-session`, { withCredentials: true });
                if (response.status === 200) {
                    navigate("/home", { replace: true });
                }
            } catch (error) {
                // not logged in, stay on sign-up
            }
        }
        checkSession();
    }, [navigate, backendUrl]);

    const handleSocial = (provider) => {
        window.location.href = `${backendUrl}/auth/${provider.toLowerCase()}`;
    };

    return (
        <div className={D.Wrapper}>
            <div className={D.Card}>
                <div className={D.TopAccent}></div>
                <div className={D.HeaderContainer}>
                    <h1 className={D.Title}>Sign Up</h1>
                    <p className={D.Subtitle}>Join FairScan via your social account</p>
                </div>
                <div className="flex flex-col gap-4">
                    {['Google', 'GitHub', 'Amazon'].map(provider => (
                        <button 
                            key={provider} 
                            onClick={() => handleSocial(provider)} 
                            className={D.SubmitBtn + customstyle}
                        >
                            Sign up with {provider}
                        </button>
                    ))}
                </div>
                <div className={D.FooterContainer}>
                    <span className={D.FooterText}>Already have an account? </span>
                    <Link to="/sign-in" className={D.FooterLink}>Sign in</Link>
                </div>
            </div>
        </div>
    );
}
export default Sign_up;