import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Deco } from "../components/jsx_deco_";
import { diagnosticTests } from "../components/diagnosticTests";
import { getLocation } from "../components/locationStore";
import Premium_hospitals from "../components/Premium_hospitals";
import "../style_2.css";

const D = Deco.SearchPage;
const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function Search() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mode_tab, setmode_tab] = useState("standard");
    const [testName, setTestName] = useState("");
    const [selected, setSelected] = useState(false);
    const [price, setPrice] = useState("");
    const [hospitalName, setHospitalName] = useState("");
    const [hospital_selected, sethospital_selected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(location.state?.result || null);
    const [error, setError] = useState("");

    // suggetions 
    const suggestions = useMemo(() => {
        if (selected || testName.length < 2) return [];
        const q = testName.toLowerCase();
        return diagnosticTests.filter(t => t.toLowerCase().includes(q)).slice(0, 6);
    }, [testName, selected]);
    const hospital_suggestions = useMemo(() => {
        if (hospital_selected || hospitalName.length < 2) return [];
        const q = hospitalName.toLowerCase();
        return Premium_hospitals.filter(h => h["Hospital name"].toLowerCase().includes(q)).slice(0, 6);
    }, [hospitalName, hospital_selected]);

    // Handlers
    const pick = (name) => { setTestName(name); setSelected(true); };
    const onType = (e) => { setTestName(e.target.value); setSelected(false); setResults(null); };
    const pick_hospital = (name) => { setHospitalName(name); sethospital_selected(true); };
    const on_hospi_type = (e) => { setHospitalName(e.target.value); sethospital_selected(false); setResults(null); };

    //submit handler
    const submit = async () => {
        const isStandardValid = mode_tab === "standard" && selected && price;
        const isPremiumValid = mode_tab === "premium" && selected && hospital_selected && price;
        if (!isStandardValid && !isPremiumValid) return;

        setLoading(true); setError("");
        const loc = getLocation();
        try {
            const res = await axios.post(`${backendUrl}/search-test`, {
                testName,
                userProvidedPrice: parseFloat(price),
                hospitalTier: mode_tab === "premium" ? "Premium" : "Standard",
                hospitalName: mode_tab === "premium" ? hospitalName : null,
                postalCode: loc?.postalCode || null,
                city: loc?.city || null,
                latitude: loc?.latitude || null,
                longitude: loc?.longitude || null
            }, { withCredentials: true });

            if (res.data?.success && res.data?.data) {
                setResults(res.data.data);
            } else {
                setError("No pricing details returned.");
            }
        } catch (e) {
            console.error(e);
            setError("Something went wrong... please try again later :)");
        } finally { setLoading(false); }
    };

    const valid_submit_check = loading || !selected || !price || (mode_tab === "premium" && !hospital_selected);

    return (
        <div className={Deco.AuthHome.Wrapper}>
            <main className={Deco.AuthHome.Main}>
                <div className={Deco.AiChat.HeaderContainer}>
                    <h1 className={Deco.AiChat.Title}>FairScan Search</h1>
                    <p className={Deco.AiChat.Subtitle}>
                        Discover fair pricing by comparing standard and corporate diagnostics.
                    </p>
                </div>

                <div className={D.Card}>
                    {/* mode */}
                    <div className={D.TabContainer}>
                        <button
                            className={mode_tab === "standard" ? D.TabButtonActiveStandard : D.TabButton}
                            onClick={() => { setmode_tab("standard"); setResults(null); setError(""); }}
                        >
                            Standard
                        </button>
                        <button
                            className={mode_tab === "premium" ? D.TabButtonActivePremium : D.TabButton}
                            onClick={() => { setmode_tab("premium"); setResults(null); setError(""); }}
                        >
                            Premium
                        </button>
                    </div>

                    {/* if premium */}
                    {mode_tab === "premium" && (
                        <div className={D.Field}>
                            <label className={D.Label}>Select a Hospital</label>
                            <div className={D.InputBox}>
                                <input type="text" className={D.Input} placeholder="e.g. Apollo Hospitals Enterprise Limited"
                                    value={hospitalName} onChange={on_hospi_type}
                                />
                                {hospital_selected && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={D.CheckIcon}>
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            {hospital_suggestions.length > 0 && (
                                <div className={D.Dropdown}>
                                    {hospital_suggestions.map((h, i) => (
                                        <div key={i} className={D.DropdownItem} onClick={() => pick_hospital(h["Hospital name"])}>
                                            {h["Hospital name"]}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!hospital_selected && hospitalName.length > 0 && <p className={D.Hint}>Please select from the dropdown list.</p>}
                        </div>
                    )}

                    {/* Test name */}
                    <div className={D.Field}>
                        <label className={D.Label}>Select Diagnosis / Test *</label>
                        <div className={D.InputBox}>
                            <input type="text" className={D.Input} placeholder="e.g., Complete Blood Count"
                                value={testName} onChange={onType}
                            />
                            {selected && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={D.CheckIcon}>
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        {suggestions.length > 0 && (
                            <div className={D.Dropdown}>
                                {suggestions.map((name, i) => (
                                    <div key={i} className={D.DropdownItem} onClick={() => pick(name)}>
                                        {name}
                                    </div>
                                ))}
                            </div>
                        )}
                        {!selected && testName.length > 0 && <p className={D.Hint}>Please select from the dropdown list.</p>}
                    </div>

                    {/* price input */}
                    <div className={D.Field}>
                        <label className={D.Label}>Price You Were Charged *</label>
                        <div className={D.InputBox}>
                            <span className={D.CurrencySymbol}>₹</span>
                            <input type="number" className={D.Input} placeholder="Enter amount"
                                value={price} onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>

                    <button className={D.SubmitBtn} onClick={submit} disabled={valid_submit_check}>
                        {loading ? "Searching..." : "Search"}
                    </button>

                    {error && <p className={D.ErrorMsg}>{error}</p>}
                </div>

                {results && (
                    <div className={D.ResultsCard}>
                        <h2 className={D.ResultsTitle}>
                            {results.city || "Your Area"}
                        </h2>
                        <div className={D.Price}>{results.localPriceRange || "Data is not available"}</div>
                        <p className={D.ResultsDesc}>
                            Based on recent community submissions and verified sources in your locality.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
export default Search;