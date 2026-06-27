import React from "react";
import { useNavigate } from "react-router-dom";
import { Deco } from "../components/jsx_deco_";

function Pub_Home() {
  const navigate = useNavigate();
  return (
    <div>
      {/* hero section */}
      <section className={Deco.PubHome.HeroWrapper}>
        <div className={Deco.PubHome.HeroContainer}>
          <h1 className={Deco.PubHome.HeroTitle}>
            Take Control of Your Healthcare Costs
          </h1>
          <p className={Deco.PubHome.HeroSubtitle}>
            Make informed medical decisions with transparent pricing and easy-to-understand prescription information.
          </p>
          <div className={Deco.PubHome.HeroCTAWrapper}>
            <button onClick={() => navigate("/sign-in")} className={Deco.PubHome.HeroPrimaryCTA}>
              start searching
            </button>
            <button onClick={() => navigate("/sign-in")} className={Deco.PubHome.HeroSecondaryCTA}>
              Upload Prescription
            </button>
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section className={Deco.PubHome.FeaturesWrapper}>
        <div className={Deco.PubHome.FeaturesContainer}>
          <div className={Deco.PubHome.SectionHeader}>
            <h2 className={Deco.PubHome.SectionTitle}>Empowering Your Medical Decisions</h2>
            <p className={Deco.PubHome.SectionSubtitle}>
              FairScan provides the tools you need to navigate the healthcare system with confidence and clarity.
            </p>
          </div>

          <div className={Deco.PubHome.FeaturesGrid}>
            {/* feature 1 */}
            <div className={Deco.PubHome.FeatureCard}>
              <div className={Deco.PubHome.FeatureIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={Deco.PubHome.FeatureTitle}>Compare & Save</h3>
              <p className={Deco.PubHome.FeatureDesc}>
                Discover the best prices for diagnostic tests at trusted local centers.
                Many people pay more than necessary for these services without knowing their options.
                Take the time to compare costs and ensure you're getting quality care at fair prices!
              </p>
            </div>

            {/* feature 2 */}
            <div className={Deco.PubHome.FeatureCard}>
              <div className={Deco.PubHome.FeatureIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className={Deco.PubHome.FeatureTitle}>Decode Your Rx</h3>
              <p className={Deco.PubHome.FeatureDesc}>
                Unsure about medical jargon? Take a photo of your prescription, and our AI will help translate it into easy-to-understand language.
              </p>
            </div>

            {/* feature 3*/}
            <div className={Deco.PubHome.FeatureCard}>
              <div className={Deco.PubHome.FeatureIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className={Deco.PubHome.FeatureTitle}>Know Your Meds</h3>
              <p className={Deco.PubHome.FeatureDesc}>
              Not sure what a prescribed medication does? Search for any drug to instantly see its general uses, active ingredients, 
              and important information in plain language.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* section 3*/}
      <section className={Deco.PubHome.TrustWrapper}>
        <div className={Deco.PubHome.TrustContainer}>
          <div className={Deco.PubHome.TrustContent}>
            <h2 className={Deco.PubHome.TrustTitle}>Data You Can Trust</h2>
            <p className={Deco.PubHome.TrustDesc}>
              Our Bill Verification system ensures that every price listed on FairScan comes from actual, verified patient bills. We protect your privacy while bringing light to hidden healthcare costs.
            </p>
            <div className={Deco.PubHome.TrustStatsContainer}>
              <div className={Deco.PubHome.TrustStat}>
                <span className={Deco.PubHome.TrustStatValue}>100%</span>
                <span className={Deco.PubHome.TrustStatLabel}>Crowd Sourced Data</span>
              </div>
              <div className={Deco.PubHome.TrustStat}>
                <span className={Deco.PubHome.TrustStatValue}>₹0</span>
                <span className={Deco.PubHome.TrustStatLabel}>Cost For Patients</span>
              </div>
              <div className={Deco.PubHome.TrustStat}>
                <span className={Deco.PubHome.TrustStatValue}>0</span>
                <span className={Deco.PubHome.TrustStatLabel}>Hidden Agendas</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-1 justify-end opacity-90">
            <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="150" r="100" fill="#D4AF37" fillOpacity="0.1" />
              <path d="M200 50 L280 80 V150 C280 210 240 250 200 270 C160 250 120 210 120 150 V80 L200 50 Z" fill="#2e0052" fillOpacity="0.8" stroke="#D4AF37" strokeWidth="2" strokeLinejoin="round" />
              <path d="M200 30 L300 65 V150 C300 220 250 270 200 290 C150 270 100 220 100 150 V65 L200 30 Z" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="6 6" />
              <path d="M165 155 L190 180 L235 125" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M100 80 L110 100 L130 110 L110 120 L100 140 L90 120 L70 110 L90 100 Z" fill="#D4AF37" fillOpacity="0.8" />
              <path d="M320 180 L325 195 L340 200 L325 205 L320 220 L315 205 L300 200 L315 195 Z" fill="#D4AF37" fillOpacity="0.6" />
            </svg>
          </div>
        </div>
      </section>
      {/* Final register section */}
      <section className={Deco.PubHome.FinalCTAWrapper}>
        <h2 className={Deco.PubHome.FinalCTATitle}>Join the movement for healthcare transparency.</h2>
        <button onClick={() => navigate("/sign-up")} className={Deco.PubHome.SecondaryCTA}>
          Register Now
        </button>
      </section>
    </div>
  );
}
export default Pub_Home;