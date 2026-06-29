# FairScan

## Aim
To develop a crowdsourced healthcare transparency platform that empowers patients to make informed medical decisions. FairScan enables users to intuitively compare diagnostic test prices across different labs, identify affordable nearby options, and utilize AI to simplify and explain complex medical prescriptions, ultimately mitigating the financial burden of medical treatments.

## Tools Used

**Frontend Ecosystem:**
*   **Core:** React.js, Vite
*   **Styling:** Tailwind CSS for a premium, accessible, and corporate-modern medical design
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios

**Backend Ecosystem:**
*   **Core Framework:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **Authentication & Security:** Passport.js (Google, Amazon, GitHub OAuth), bcrypt, JWT
*   **Queueing & Caching:** Redis, BullMQ (for reliable background job processing)
*   **File Handling:** Multer (for handling sensitive medical bill and prescription uploads)
*   **Logging & Security:** Winston, express-rate-limit, Helmet

## Complete User Path Flows

### Flow 1: User Registration & Onboarding
1. **Landing:** User arrives at the FairScan landing page.
2. **Sign-up/Login:** User clicks "Sign Up" or "Login" to access the platform.
3. **Authentication:** User authenticates via traditional credentials or OAuth providers (Google, Amazon, GitHub).
4. **Dashboard:** Upon successful login, the user is directed to the home dashboard to access primary features.

### Flow 2: Searching & Comparing Diagnostic Test Prices
1. **Search Initiation:** User navigates to the "Search Tests" section.
2. **Query:** User enters the name of the required diagnostic test (e.g., "MRI Brain", "Blood Test").
3. **Data Retrieval:** The system fetches and displays local pricing data, including average costs, minimum/maximum prices, and a list of available diagnostic centers.
4. **Fallback Execution (if needed):** If local data is unavailable, the system applies the pricing hierarchy (Constituency -> District -> State -> National) to provide the closest estimated cost.
5. **Decision Making:** User compares the available options and makes an informed decision on where to undergo the test.

### Flow 3: Contributing Data (Crowdsourcing & Verification)
1. **Post-Test Action:** After completing a medical test, the user returns to FairScan and navigates to the "Contribute" section.
2. **Data Entry:** User inputs the test details, price paid, diagnostic center name, and location.
3. **Bill Upload:** User securely uploads a scanned copy or image of the medical bill.
4. **Queueing:** The system receives the submission and queues it via BullMQ for background processing.
5. **Verification & Integration:** The system verifies the bill to detect suspicious entries. Once verified, the data is integrated into the PostgreSQL database, improving pricing accuracy for future users.

### Flow 4: AI-Powered Prescription Simplification
1. **Upload Initiation:** A user struggling to understand a complex medical prescription navigates to the "Analyze Prescription" feature.
2. **File Upload:** User uploads an image of the prescription.
3. **AI Processing:** The AI system processes the image, extracts the medicine names, and translates medical terminology.
4. **Simplification Output:** The platform generates and displays a simplified, plain-language breakdown of the medicines and their common uses.
5. **Comprehension:** The user reads the simplified breakdown, allowing them to confidently understand their treatment plan.
