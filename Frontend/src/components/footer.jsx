import React from "react";
import { Link } from "react-router-dom";
import { Deco } from "./jsx_deco_";
function Footer() {
    return (
        <footer className={Deco.Footer.Wrapper}>
            <div className={Deco.Footer.Container}>
                <div className={Deco.Footer.LogoText}>FairScan</div>
                <div className={Deco.Footer.BottomRow}>
                    <div className={Deco.Footer.Copyright}>
                        {'\u00A9'} {new Date().getFullYear()} FairScan. Designed and built by Dilip Sai.
                    </div>
                    <ul className={Deco.Footer.NavList}>
                        <li><Link to="/about" className={Deco.Footer.NavLink}>About FairScan</Link></li>
                        <li><Link to="/contact-us" className={Deco.Footer.NavLink}>Contact Us</Link></li>
                        <li><Link to="/privacy-policy" className={Deco.Footer.NavLink}>Privacy Policy</Link></li>
                        <li><Link to="/terms-conditions" className={Deco.Footer.NavLink}>Terms & Conditions</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
export default Footer;