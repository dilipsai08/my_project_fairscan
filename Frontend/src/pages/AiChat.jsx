import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Deco } from "../components/jsx_deco_";
function AiChat() {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const galleryInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        if (location.state?.result) {
            setAiResponse(location.state.result.response || location.state.result);
        }
    }, [location.state]);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleSubmit = async () => {
        if (!imageFile) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("prescription", imageFile);
        formData.append("query", query);
        try {
            const res = await axios.post(`${backendUrl}/api/ai-chat-submit`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.queued) {
                navigate("/queue", {
                    state: {
                        requestId: res.data.requestId,
                        jobId: res.data.jobId,
                        initialPosition: res.data.position,
                        testName: "Prescription Analysis"
                    }
                });
            } else {
                setAiResponse(res.data.response || res.data);
            }
        } catch (error) {
            console.error("AI Chat Error:", error);
            setAiResponse("Something went Wrong... Try Again Later :)");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={Deco.AuthHome.Wrapper}>
            <main className={Deco.AuthHome.Main}>
                <div className={Deco.AiChat.HeaderContainer}>
                    <h1 className={Deco.AiChat.Title}>Prescription Assistant</h1>
                    <p className={Deco.AiChat.Subtitle}>Upload your prescription for assistance from our AI regarding your medication inquiries.</p>
                </div>
                {/*disclaimer*/}
                <div className={Deco.AiChat.Disclaimer}>
                    <strong>Legal & Medical Disclaimer:</strong> The AI response is generated for informational and educational purposes only.
                    It does not constitute professional medical advice, diagnosis, or treatment.
                    Always consult a qualified healthcare provider with any medical questions or concerns.
                    FairScan assumes no liability for actions taken based on this information.
                </div>
                {/* input card*/}
                <div className={Deco.AiChat.Card}>
                    <input type="file" accept="image/*" ref={galleryInputRef} onChange={handleFileChange} className="hidden" />
                    <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
                    {/* img preview*/}
                    <div className={Deco.AiChat.ImageSection}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Prescription" className={Deco.AiChat.ImagePreview} />
                        ) : (
                            <div className={Deco.AiChat.ImagePlaceholder}>
                                <span className="text-on-surface-variant text-body-md opacity-70">No prescription uploaded</span>
                            </div>
                        )}
                        <div className={Deco.AiChat.ButtonRow}>
                            <button onClick={() => cameraInputRef.current.click()} className={Deco.AiChat.PrimaryButton}>
                                📸 Take Photo
                            </button>
                            <button onClick={() => galleryInputRef.current.click()} className={Deco.AiChat.SecondaryButton}>
                                🖼️ Upload
                            </button>
                        </div>
                    </div>
                    {/* text input*/}
                    <div className={Deco.AiChat.InputSection}>
                        <textarea
                            className={Deco.AiChat.TextArea}
                            placeholder="Your query (optional)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !imageFile}
                            className={Deco.AiChat.SubmitButton}
                        >
                            {loading ? "Please Wait..." : "Submit"}
                        </button>
                    </div>
                </div>
                {/* Response */}
                {aiResponse && (
                    <div className={Deco.AiChat.ResponseCard}>
                        <h3 className={Deco.AiChat.ResponseTitle}>AI Explanation</h3>
                        <p className={Deco.AiChat.ResponseText}>{aiResponse}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
export default AiChat;
