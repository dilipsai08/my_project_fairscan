import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'
import './style.css'
import './style_2.css'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Home from './pages/Home.jsx'
import MedicineInfo from './pages/medicine_info.jsx'
import AiChat from './pages/AiChat.jsx'
import Search from './pages/Search.jsx'
import Queue from './pages/Queue.jsx'
import About from './pages/About.jsx'
import Contact_Us from './pages/Contact_Us.jsx'
import Profile from './pages/Profile.jsx'
import Sign_In from './pages/Sign In.jsx'
import PublicHeader from './components/public_header.jsx'
import Sign_up from './pages/Sign Up.jsx'
import After_Sign_up from './pages/After_Sign_up.jsx'
import Pub_Home from './pages/Pub_Home.jsx'
import PrivacyPolicy from './pages/Privacy Policy.jsx'
import TermsAndConditions from './pages/Terms & Conditions.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import OAuth_Success from './pages/OAuth_Success.jsx'

axios.defaults.withCredentials = true;

function AppHeader() {
  const location = useLocation();
  const publicPaths = ['/', '/sign-in', '/sign-up', '/about', '/contact-us', '/privacy-policy', '/terms-conditions'];
  if (publicPaths.includes(location.pathname)) {
    return <PublicHeader />;
  }
  return <Header />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Pub_Home />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/queue" element={<ProtectedRoute><Queue /></ProtectedRoute>} />
        <Route path="/ai-chat" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
        <Route path="/medicine-info" element={<ProtectedRoute><MedicineInfo /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact_Us />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/sign-in" element={<Sign_In />} />
        <Route path="/sign-up" element={<Sign_up />} />
        <Route path="/after-sign-up" element={<After_Sign_up />} />
        <Route path="/oauth-success" element={<OAuth_Success />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)

