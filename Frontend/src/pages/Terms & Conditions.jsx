import React from 'react';
import { Deco } from '../components/jsx_deco_';

const TermsAndConditions = () => {
    const styles = Deco.About; // Reusing the same minimal styling pattern

    return (
        <div className={styles.Wrapper}>
            <section className={styles.HeroSection}>
                <h1 className={styles.HeroTitle}>Terms & Conditions</h1>
            </section>

            <section className={styles.ContentContainer}>
                <p className={styles.Paragraph}>
                    By accessing or using FairScan, you agree to be bound by these Terms and Conditions. FairScan is a platform designed to provide crowdsourced pricing information and AI-assisted explanations for medical prescriptions. The information provided is for educational and informational purposes only and does not constitute professional medical advice, diagnosis, or treatment.
                </p>
                <p className={styles.Paragraph}>
                    You agree to use the platform responsibly and ensure that any information or documents you upload are accurate and do not violate any third-party rights. FairScan reserves the right to suspend or terminate access to anyone found misusing the service or uploading fraudulent information. Always consult a qualified healthcare provider before making medical decisions.
                </p>
            </section>
        </div>
    );
};

export default TermsAndConditions;
