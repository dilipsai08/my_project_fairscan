import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Deco } from "./jsx_deco_";
function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <header className={Deco.Header.Wrapper}>
            {/* mobile view only */}
            <div className={Deco.Header.MobileContainer}>
                <div className={Deco.Header.MobileTopBar}>
                    <div className={Deco.Header.LogoWrapper}>
                        {/* logo */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={Deco.Header.LogoIcon}>
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <Link to="/home" className={Deco.Header.LogoText}>FairScan</Link>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={Deco.Header.MobileMenuBtn}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
                {isMobileMenuOpen && (
                    <nav>
                        <ul className={Deco.Header.MobileNavList}>
                            <li><Link to="/search" className={Deco.Header.NavLink}>Search</Link></li>
                            <li><Link to="/ai-chat" className={Deco.Header.NavLink}>Upload Rx</Link></li>
                            <li><Link to="/medicine-info" className={Deco.Header.NavLink}>Medicine Info</Link></li>
                            <li><Link to="/profile" className={Deco.Header.NavLink}>Profile</Link></li>
                        </ul>
                    </nav>
                )}
            </div>
            {/* desktop view only */}
            <div className={Deco.Header.DesktopContainer}>
                <div className={Deco.Header.LogoWrapper}>
                    {/* logo*/}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={Deco.Header.LogoIcon}>
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <Link to="/home" className={Deco.Header.LogoText}>FairScan</Link>
                </div>
                <nav>
                    <ul className={Deco.Header.DesktopNavList}>
                        <li><Link to="/search" className={Deco.Header.NavLink}>Search</Link></li>
                        <li><Link to="/ai-chat" className={Deco.Header.NavLink}>Upload Rx</Link></li>
                        <li><Link to="/medicine-info" className={Deco.Header.NavLink}>Medicine Info</Link></li>
                    </ul>
                </nav>
                <div>
                    <Link to="/profile" className={Deco.Header.ProfileBtn} aria-label="User Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </header>
    );
}
export default Header;