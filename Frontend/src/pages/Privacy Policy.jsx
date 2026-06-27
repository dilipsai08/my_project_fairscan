import React from 'react';
import { Deco } from '../components/jsx_deco_';

const PrivacyPolicy = () => {
    const styles = Deco.About;

    return (
        <div className={styles.Wrapper}>
            <section className={styles.HeroSection}>
                <h1 className={styles.HeroTitle}>Privacy Policy</h1>
            </section>

            <section className={styles.ContentContainer}>
                <p className={styles.Paragraph}>
                    At FairScan, we take your privacy seriously. This Privacy Policy outlines the types of personal information we receive and collect when you use our services, as well as some of the steps we take to safeguard information. We hope this will help you make an informed decision about sharing personal information with us.
                </p>
                <p className={styles.Paragraph}>
                    We collect minimal personal data to provide a better user experience. Any diagnostic bills or prescription documents you upload are securely processed, stripped of personally identifiable information where possible, and only used to improve our crowdsourced database and AI translation services. Your data will never be sold to third parties.
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
