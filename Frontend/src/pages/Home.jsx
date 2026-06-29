import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Deco } from "../components/jsx_deco_";
import { saveLocation, getLocation } from "../components/locationStore";

const D = Deco.AuthHome;
const backendUrl = "";

// default tips
const health_tips = [
    { category: "Blood Test", tip: "Fast for 8–12 hours before a lipid panel or fasting blood sugar test for accurate results." },
    { category: "Medication", tip: "Always complete the full course of antibiotics, even if you feel better — stopping early breeds resistant bacteria." },
    { category: "Heart Health", tip: "A resting heart rate of 60–100 BPM is normal. Regular cardio can lower it over time." },
    { category: "Bone Health", tip: "Vitamin D deficiency is extremely common in India. Get your levels checked if you feel fatigued." },
    { category: "Lab Tip", tip: "Drink plenty of water before a urine test — dehydration can affect the concentration of results." },
    { category: "Checkup", tip: "Adults over 30 should get a full body checkup at least once a year, even without symptoms." },
];

const SEARCH_FLOW = [
    {
        step: "01",
        title: "Search a Test",
        desc: "Enter the diagnostic test or scan you need — from blood work to MRI.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={D.HiwIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        ),
    },
    {
        step: "02",
        title: "Compare Prices",
        desc: "See real prices from hospitals and labs near your pincode, side by side.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={D.HiwIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
    },
    {
        step: "03",
        title: "Save Money",
        desc: "Pick the best deal and avoid overpaying. It's that simple.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={D.HiwIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
        ),
    },
];

const TOOLS = [
    {
        title: "Compare Prices",
        desc: "Find fair pricing for diagnostic tests at hospitals and labs near your location.",
        path: "/search",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={D.ToolIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        ),
    },
    {
        title: "AI Doubt Assistant",
        desc: "Upload your prescription or bill and let AI explain everything in plain language.",
        path: "/ai-chat",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={D.ToolIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
    },
    {
        title: "Medicine Lookup",
        desc: "Search any medication to see its usage, warnings, and available pricing information.",
        path: "/medicine-info",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={D.ToolIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
        ),
    },
];

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={D.ToolArrowIcon}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

function Home() {
    const navigate = useNavigate();
    const [location, setLocation] = useState("Detecting location…");
    const [userName, setUserName] = useState("");
    const [savings, setSavings] = useState("₹0");
    const [healthTips, setHealthTips] = useState(health_tips);
    const [activeTip, setActiveTip] = useState(0);
    const [user, setuser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/info`);
                if (data) {
                    setUserName(data.userName);
                    setSavings(data.savings);
                    setuser(data);
                }
            } catch {
                setUserName("User");
            }
        })();
    }, []);

    // health tips request
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/health-tips`);
                if (data?.tips?.length) {
                    const mapped = data.tips.map((t) => ({
                        icon: t.icon || "💡",
                        category: t.category,
                        tip: t.tip,
                    }));
                    setHealthTips(mapped);
                }
            } catch {
                console.log("health tips request failed");
            }
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/info`);
                if (data) {
                    setuser(data);
                    if (data.userName) setUserName(data.userName);
                    if (data.savings) setSavings(data.savings);
                }
            } catch (err) {
                console.log("user info request failed in health tips fetch", err);
            }
        })();
    }, []);

    // location detection
    const detectLocation = (force = false) => {
        if (!force) {
            const saved = getLocation();
            if (saved?.city) {
                setLocation(`${saved.city}, ${saved.state}`);
                return;
            }
        }
        setLocation("Detecting location…");

        const ipFallback = async () => {
            try {
                const rawUrl = import.meta.env.VITE_LOCATION_URL;
                const locationUrl = rawUrl ? rawUrl.replace(/"/g, "") : "https://ipapi.co/json/";
                const res = await fetch(locationUrl);
                const data = await res.json();
                if (data.city && data.region) {
                    setLocation(`${data.city}, ${data.region}`);
                    saveLocation({ city: data.city, state: data.region, postalCode: data.postal || "", lat: data.latitude, lng: data.longitude });
                } else setLocation("Location Unavailable");
            } catch { setLocation("Location Unavailable"); }
        };

        const onPosition = (pos) => {
            const { latitude, longitude } = pos.coords;
            const onposKey = (import.meta.env.VITE_ONPOS_API_KEY || "").replace(/"/g, "");
            const onposUrl = (import.meta.env.VITE_ONPOS_URL || "").replace(/"/g, "");
            fetch(`${onposUrl}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${onposKey}`)
                .then(r => r.json())
                .then(data => {
                    const city = data.city || data.locality;
                    const state = data.principalSubdivision || "";
                    const postalCode = data.postcode || "";
                    if (city) {
                        setLocation(`${city}${state ? ", " + state : ""}`);
                        saveLocation({ city, state, postalCode, lat: latitude, lng: longitude });
                    } else ipFallback();
                })
                .catch(() => ipFallback());
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(onPosition, () => ipFallback(), { timeout: 5000 });
        } else ipFallback();
    };

    useEffect(() => {
        detectLocation(false);
    }, []);

    //health tips----->rotate
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTip((prev) => (prev + 1) % healthTips.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [healthTips.length]);

    return (
        <div className={D.Wrapper}>
            <main className={D.Main}>

                {/* hero section */}
                <div className={D.HeroWrapper}>
                    <h1 className={D.Greeting}>Welcome back, {userName}.</h1>

                    {/* location bar*/}
                    <div className={D.LocationBadge} title="Location">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={D.LocationIcon}>
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span>{location}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={D.LocationEditIcon + " cursor-pointer hover:rotate-180 transition-all duration-500"}
                            onClick={(e) => {
                                e.stopPropagation();
                                detectLocation(true);
                            }}
                            title="Click to detect location again"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </div>

                    {/* stats  */}
                    <div className={D.StatsContainer}>
                        {[
                            { value: savings, label: "Lifetime Savings" },
                            { value: user?.testscompared || 0, label: "Tests Compared" },
                        ].map((s, i) => (
                            <div key={i} className={D.StatWidget}>
                                <span className={D.StatValue}>{s.value}</span>
                                <span className={D.StatLabel}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Tools Grid  ── */}
                <div className={D.ToolsGrid}>
                    {TOOLS.map((tool, i) => (
                        <div key={i} className={D.ToolCard} onClick={() => navigate(tool.path)}>
                            <div className={D.ToolHeader}>
                                <div className={D.ToolIconWrapper}>{tool.icon}</div>
                                <h3 className={D.ToolTitle}>{tool.title}</h3>
                            </div>
                            <p className={D.ToolDesc}>{tool.desc}</p>
                            <div className={D.ToolArrow}><ArrowIcon /></div>
                        </div>
                    ))}
                </div>

                {/*health tips section*/}
                <div className={D.TipsSection}>
                    <h2 className={D.TipsHeading}>
                        <div className={D.TipsHeadingIconBox}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={D.TipsHeadingIcon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                            </svg>
                        </div>
                        Health Tips
                    </h2>
                    <div className={`${D.TipsFeaturedCard} group relative`}>
                        <div className={D.TipsFeaturedLayout}>
                            <div className={D.TipsFeaturedContent}>
                                <span className={D.TipsFeaturedCategory}>
                                    {healthTips[activeTip]?.category}
                                </span>
                                <p className={D.TipsFeaturedText}>
                                    {healthTips[activeTip]?.tip}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveTip((prev) => (prev - 1 + healthTips.length) % healthTips.length)}
                            className={D.TipsArrowLeft}
                            aria-label="Previous Tip"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setActiveTip((prev) => (prev + 1) % healthTips.length)}
                            className={D.TipsArrowRight}
                            aria-label="Next Tip"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                        {/*dots*/}
                        <div className={D.TipsDotsRow}>
                            {healthTips.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTip(i)}
                                    className={i === activeTip ? D.TipsDotActive : D.TipsDotInactive}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/*how search works*/}
                <div className={D.HiwSection}>
                    <h2 className={D.HiwHeading}>How FairScan Search Works</h2>
                    <div className={D.HiwGrid}>
                        {SEARCH_FLOW.map((s, i) => (
                            <div key={i} className={`${D.HiwCard} group`}>
                                {/*number*/}
                                <span className={D.HiwStepNumber}>{s.step}</span>
                                {/*icon*/}
                                <div className={D.HiwIconBox}>
                                    {s.icon}
                                </div>
                                {/*title*/}
                                <h3 className={D.HiwTitle}>{s.title}</h3>
                                {/*description*/}
                                <p className={D.HiwDesc}>{s.desc}</p>
                                {/*arrow*/}
                                {i < SEARCH_FLOW.length - 1 && (
                                    <div className={D.HiwConnector}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={D.HiwConnectorIcon}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className={D.HiwCtaRow}>
                        <button onClick={() => navigate('/search')} className={D.HiwCtaBtn}>
                            Search Now →
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default Home;