import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Deco } from '../components/jsx_deco_';

const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const Profile = () => {
    const styles = Deco.Profile;

    const [user, setUser] = useState();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, activityRes] = await Promise.all([
                    axios.get(`${backendUrl}/api/user/profile`, { withCredentials: true }),
                    axios.get(`${backendUrl}/api/user/activity`, { withCredentials: true })
                ]);
                if (profileRes.data?.success && profileRes.data?.profile) {
                    setUser(profileRes.data.profile);
                }
                if (activityRes.data?.success && activityRes.data?.activities) {
                    setActivities(activityRes.data.activities);
                }
            } catch (err) {
                console.log("Backend profile/activity API not ready yet. Using local fallback data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className={styles.LoadingWrapper}>
                <div className={styles.LoadingText}>Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.ErrorWrapper}>
                <h1 className={styles.ErrorTitle}>Profile unavailable</h1>
                <p className={styles.ErrorDesc}>
                    We could not load your profile. Please sign in again.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.Wrapper}>
            <section className={styles.HeaderSection}>
                <div className={styles.HeaderLeft}>
                    <h1 className={styles.HeaderTitle}>{user.name}'s Dashboard</h1>
                    <p className={styles.HeaderSubtitle}>Your Impact Overview</p>
                </div>
                <button
                    onClick={async () => {
                        try {
                            await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
                            window.location.href = "/sign-in";
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                    className={styles.LogoutBtn}
                >
                    Logout
                </button>
            </section>

            <section className={styles.MainContainer}>
                <div className={styles.ProfileGrid}>

                    {/* personal info*/}
                    <div className={styles.InfoCard}>
                        <div className={styles.AvatarWrapper}>
                            <svg className={styles.AvatarIcon} fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        </div>
                        <h2 className={styles.UserName}>{user.name}</h2>
                        <p className={styles.UserEmail}>{user.email}</p>

                        <span className={styles.Badge}>
                            <svg className="w-4 h-4 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified Contributor
                        </span>

                        <div className={styles.InfoList}>
                            <div className={styles.InfoRow}>
                                <span className={styles.InfoLabel}>Address</span>
                                <span className={styles.InfoValue}>{user.location}</span>
                            </div>
                            <div className={styles.InfoRow}>
                                <span className={styles.InfoLabel}>Member Since</span>
                                <span className={styles.InfoValue}>{user.joinDate}</span>
                            </div>
                            <div className={styles.InfoRow}>
                                <span className={styles.InfoLabel}>Account Status</span>
                                <span className={styles.InfoValue}>Active</span>
                            </div>
                        </div>
                    </div>

                    {/* stats and activity*/}
                    <div className={styles.StatsContainer}>

                        {/* Stats */}
                        <div className={styles.StatsGrid}>

                            {/* 1 total contributions*/}
                            <div className={styles.StatCard}>
                                <div className={styles.StatHeader}>
                                    <div className={styles.StatIconWrapper}>
                                        <svg className={styles.StatIcon} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <span className={styles.StatTitle}>Total Contributions</span>
                                </div>
                                <h3 className={styles.StatValue}>{user.totalContributions}</h3>
                                <p className={styles.StatSubtext}>Verified medical bills uploaded</p>
                            </div>

                            {/* 2 savings */}
                            <div className={styles.StatCard}>
                                <div className={styles.StatHeader}>
                                    <div className={styles.StatIconWrapper}>
                                        <svg className={styles.StatIcon} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <span className={styles.StatTitle}> Savings</span>
                                </div>
                                <h3 className={styles.StatValue}>{user.estimatedSavingsImpact}</h3>
                                <p className={styles.StatSubtext}>Your savings with FairScan</p>
                            </div>

                            {/* 3 Trust Score */}
                            <div className={styles.StatCard}>
                                <div className={styles.StatHeader}>
                                    <div className={styles.StatIconWrapper}>
                                        <svg className={styles.StatIcon} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    </div>
                                    <span className={styles.StatTitle}>Trust Score</span>
                                </div>
                                <h3 className={styles.StatValue}>{user.trustScore}</h3>
                                <p className={styles.StatSubtext}>Your trust score</p>
                            </div>
                        </div>

                        {/* activity */}
                        <div className={styles.ActivityCard}>
                            <h2 className={styles.ActivityHeader}>Recent Contributions</h2>
                            <div className={styles.ActivityList}>
                                {activities.length > 0 ? (
                                    activities.map((act) => (
                                        <div key={act.id} className={styles.ActivityItem}>
                                            <div className={styles.ActivityDot}></div>
                                            <div className={styles.ActivityContent}>
                                                <p className={styles.ActivityTitle}>{act.description || act.title}</p>
                                                <p className={styles.ActivityDate}>
                                                    {act.verified_at ? `Verified on ${new Date(act.verified_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}` : act.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={styles.ActivityEmpty}>No recent activity found.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
