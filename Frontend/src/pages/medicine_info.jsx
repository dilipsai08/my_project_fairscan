import React, { useState } from "react";
import axios from "axios";
import { Deco } from "../components/jsx_deco_";
import "../style_2.css";

function MedicineInfo() {
    const [query, setQuery] = useState("");
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

    async function handle_search() {
        if (!query.trim()) {
            setInfo(null);
            return;
        }
        setLoading(true);
        setInfo(null);
        try {
            const response = await axios.get(`${backendUrl}/medicine/info`, { 
                params: { q: query },
                withCredentials: true 
            });
            setInfo(response.data);
        } catch (err) {
            console.error(err);
            setInfo({ error: "Something went wrong. Please try again later." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={Deco.AuthHome.Wrapper}>
            <main className={Deco.AuthHome.Main}>
                <h1 className={Deco.AuthHome.Greeting}>Medicine Information</h1>

                <div className={Deco.MedicineInfo.WarningBox}>
                    <strong>Disclaimer:</strong> This is for educational purposes only. Always consult a doctor for medical advice.
                </div>

                <div className={Deco.MedicineInfo.SearchContainer}>
                    <div className={Deco.AuthHome.RxInputBox}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={Deco.AuthHome.RxSearchIcon}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            className={Deco.AuthHome.RxInput}
                            placeholder="Search medicine by name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handle_search()}
                        />
                        <button className={Deco.AuthHome.RxButton} onClick={handle_search} disabled={loading}>
                            {loading ? "Searching..." : "Search"}
                        </button>
                    </div>
                </div>

                {info && (
                    <div className={Deco.MedicineInfo.ResultCard}>
                        {info.error ? (
                            <div className={Deco.MedicineInfo.ResultError}>
                                {info.error}
                            </div>
                        ) : (
                            <>
                                <h2 className={Deco.MedicineInfo.ResultTitle}>{info.name}</h2>
                                <div className={Deco.MedicineInfo.ResultContent}>
                                    <div className={Deco.MedicineInfo.ResultGrid}>
                                        <div>
                                            <span className={Deco.MedicineInfo.ResultHeading}>Price</span>
                                            <p className={Deco.MedicineInfo.ResultText}>{info.price}</p>
                                        </div>
                                        <div>
                                            <span className={Deco.MedicineInfo.ResultHeading}>Manufacturer</span>
                                            <p className={Deco.MedicineInfo.ResultText}>{info.manufacturer_name}</p>
                                        </div>
                                    </div>
                                    <div className={Deco.MedicineInfo.ResultDivider} />
                                    <div>
                                        <span className={Deco.MedicineInfo.ResultHeading}>General Use</span>
                                        <p className={Deco.MedicineInfo.ResultText}>{info.general_use}</p>
                                    </div>
                                    <div className={Deco.MedicineInfo.ResultDivider} />
                                    <div>
                                        <span className={Deco.MedicineInfo.ResultHeading}>Side Effects</span>
                                        <p className={Deco.MedicineInfo.ResultText}>{info.side_effects}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
export default MedicineInfo;