import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Deco } from "../components/jsx_deco_";
import "../style_2.css";

const Q = Deco.QueuePage;
const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const STEPS = ["Submitted", "In Queue", "Processing", "Complete"];

function Queue() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const esRef = useRef(null);

    const [position, setPosition] = useState(state?.initialPosition || "--");
    const [status, setStatus] = useState("Connecting to queue…");
    const [step, setStep] = useState(0);       // 0-3 maps to STEPS
    const [progress, setProgress] = useState(5);
    const [eta, setEta] = useState("--");
    const [result, setResult] = useState(null);

    // Open SSE stream on mount
    useEffect(() => {
        if (!state?.requestId) { navigate("/search"); return; }

        const url = `${backendUrl}/api/queue/status?requestId=${state.requestId}${state.jobId ? `&jobId=${state.jobId}` : ''}`;
        const es = new EventSource(url, { withCredentials: true });
        esRef.current = es;

        es.addEventListener("queueUpdate", (e) => {
            const d = JSON.parse(e.data);
            setPosition(d.position);
            setEta(d.eta || "--");
            setStep(1);
            setProgress(Math.min(30 + (1 / Math.max(d.position, 1)) * 40, 70));
            setStatus(`You're #${d.position} in the queue`);
        });

        es.addEventListener("processing", () => {
            setStep(2);
            setProgress(80);
            setStatus("Your request is being processed…");
        });

        es.addEventListener("completed", (e) => {
            const d = JSON.parse(e.data);
            setStep(3);
            setProgress(100);
            setStatus("Done! Redirecting to results…");
            setResult(d);
            es.close();
            setTimeout(() => navigate("/ai-chat", { state: { result: d } }), 2000);
        });

        es.addEventListener("failed", (e) => {
            setStatus(JSON.parse(e.data).message || "Something went wrong.");
            es.close();
        });

        es.onerror = () => {
            setStatus("Connection lost. Retrying…");
        };

        return () => es.close();
    }, []);

    const dotClass = (i) =>
        i < step ? Q.StepDotDone : i === step ? Q.StepDotActive : Q.StepDot;

    return (
        <div className={Deco.AuthHome.Wrapper}>
            <main className={Deco.AuthHome.Main}>
                <div className={Deco.AiChat.HeaderContainer}>
                    <h1 className={Deco.AiChat.Title}>Your Queue</h1>
                    <p className={Deco.AiChat.Subtitle}>
                        Hang tight — we're processing your search request.
                    </p>
                </div>

                <div className={Q.Card}>
                    {/* Position badge */}
                    <div className={Q.PositionBadge}>
                        <span className={Q.PositionNumber}>{position}</span>
                        <span className={Q.PositionLabel}>Position</span>
                    </div>

                    {/* Progress bar */}
                    <div className={Q.ProgressTrack}>
                        <div className={Q.ProgressFill} style={{ width: `${progress}%` }} />
                    </div>

                    {/* Status text */}
                    <p className={Q.StatusText}>{status}</p>

                    {/* Step indicators */}
                    <div className={Q.StepList}>
                        {STEPS.map((label, i) => (
                            <div key={label} className={Q.StepItem}>
                                <div className={dotClass(i)} />
                                <span className={Q.StepLabel}>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Info rows */}
                    {state?.testName && (
                        <div className={Q.InfoRow}>
                            <span className={Q.InfoLabel}>Test</span>
                            <span className={Q.InfoValue}>{state.testName}</span>
                        </div>
                    )}

                    {/* Wait timer */}
                    {eta !== "--" && (
                        <div className={Q.EtaBox}>
                            <span className={Q.EtaValue}>{eta}</span>
                            <span className={Q.EtaLabel}>Estimated Wait</span>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Queue;
