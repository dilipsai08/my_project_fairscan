import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Deco } from '../components/jsx_deco_.js';

function After_Sign_up() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const onboardingToken = searchParams.get('token');
    const [form, setForm] = useState({ username: '', location: '', pincode: '', password: '', confirmPassword: '', bloodGroup: '' });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const blood_grps = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const filtered = blood_grps.filter(b => b.toLowerCase().includes(search.toLowerCase()));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        setLoading(true);
        setError("");
        if (!onboardingToken) {
            navigate('/sign-up');
            return;
        }
        try {
            const data = await axios.post('/api/auth/complete-profile', { onboardingToken, ...form });
            if(data.status===200){
                navigate("/home");
            }else{
                navigate("/complete-profile");
            }
        } catch {
            console.error("something went wrong");
            navigate('/sign-up');
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