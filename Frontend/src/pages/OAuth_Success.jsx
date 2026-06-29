import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function OAuth_Success() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/home');
        } else {
            navigate('/sign-in');
        }
    }, [navigate, location]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="text-primary font-inter font-semibold tracking-wider uppercase">Authenticating...</div>
        </div>
    );
}

export default OAuth_Success;
