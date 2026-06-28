import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Deco } from '../components/jsx_deco_.js';
import { bloodGroups } from '../components/blood_groups.js';

function After_Sign_up() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const onboardingToken = searchParams.get('token');
    const [form, setForm] = useState({ username: '', address: '', pincode: '', password: '', confirmPassword: '', bloodGroup: '' });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const filtered = bloodGroups.filter(b => b.toLowerCase().includes(search.toLowerCase())).slice(0, 12);
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

    useEffect(() => {
        if (!onboardingToken) {
            setError("Your sign-up session is missing. Please start sign-up again.");
        }
    }, [onboardingToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        setLoading(true);
        setError("");
        if (!onboardingToken) {
            setError("Your sign-up session is missing. Please start sign-up again.");
            setLoading(false);
            return;
        }
        try {
            const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
            const data = await axios.post(`${backendUrl}/auth/complete-profile`, { onboardingToken, ...form });
            if(data.status===200){
                navigate("/home");
            }else{
                navigate("/after-sign-up");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Could not complete profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const D = Deco.SignInPage;
    return (
        <div className={D.Wrapper}>
            <div className={D.Card + " !max-w-[480px] my-6"}>
                <div className={D.TopAccent}></div>
                <div className={D.HeaderContainer}>
                    <h1 className={D.Title}>Complete Profile</h1>
                    <p className={D.Subtitle}>Enter remaining details to register</p>
                </div>
                {error && <div className="text-error text-center font-jakarta text-[14px]">{error}</div>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {['username', 'location', 'pincode', 'password', 'confirmPassword'].map(field => (
                        <div key={field} className={D.Field}>
                            <label className={D.Label}>{field.replace(/([A-Z])/g, ' $1')}</label>
                            <div className={D.InputBox}>
                                <input 
                                    type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                                    className={D.Input} 
                                    placeholder={`Enter your ${field}`} 
                                    value={form[field]} 
                                    onChange={e => setForm({ ...form, [field]: e.target.value })} 
                                    required 
                                />
                            </div>
                        </div>
                    ))}
                    <div className={D.Field}>
                        <label className={D.Label}>Blood Group</label>
                        <div className={D.InputBox}>
                            <input 
                                className={D.Input} 
                                placeholder="Search Blood Group..." 
                                value={search} 
                                onChange={e => setSearch(e.target.value)} 
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {filtered.map(bg => (
                                <button 
                                    key={bg} 
                                    type="button" 
                                    onClick={() => { setForm({ ...form, bloodGroup: bg }); setSearch(bg); }} 
                                    className={`py-2 text-xs font-bold rounded border cursor-pointer ${
                                        form.bloodGroup === bg 
                                        ? 'bg-primary text-white border-primary' 
                                        : 'bg-white text-gray-700 border-surface-variant hover:border-primary'
                                    }`}
                                >
                                    {bg}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className={D.SubmitBtn}>
                        {loading ? "Saving..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default After_Sign_up;
