import React from 'react';
import { Deco } from '../components/jsx_deco_';

const About = () => {
    const styles = Deco.About;

    return (
        <div className={styles.Wrapper}>
            <section className={styles.HeroSection}>
                <h1 className={styles.HeroTitle}>About FairScan</h1>
            </section>

            <section className={styles.ContentContainer}>
                <p className={styles.Paragraph}>
                    FairScan is a crowdsourced healthcare transparency platform designed to help patients compare diagnostic test prices and find the most affordable options nearby. By gathering community-contributed pricing data, FairScan empowers everyone to make smarter, more cost-effective healthcare decisions.
                </p>
                <p className={styles.Paragraph}>
                    FairScan also uses AI to make prescriptions easier to understand. It translates complicated medical terms into simple language and explains how prescribed medicines are commonly used. Our aim is to make medical bills and prescriptions clear, reducing the confusion in the healthcare process.        </p>
            </section>
        </div>
    );
};

export default About;
