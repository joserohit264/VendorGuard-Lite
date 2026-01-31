# VendorGuard Lite 🛡️

**VendorGuard Lite** is a modern, automated Vendor Risk Management (VRM) platform designed to streamline the assessment and tracking of third-party security risks. 

It moves GRC from manual spreadsheets to an automated, algorithmic approach, dynamically calculating risk scores and prescribing remediation controls (ISO 27001 / SOC 2) based on vendor attributes.

![Dashboard Preview](https://via.placeholder.com/800x400?text=VendorGuard+Dashboard)

## 🚀 Key Features

### 1. Algorithmic Risk Scoring
Stop guessing. The **Risk Engine** (`/lib/riskEngine.ts`) automatically calculates a risk score (0-100) and tier (Low/Medium/Critical) based on weighed factors:
*   **Data Sensitivity**: Does the vendor store PII? (+40 points)
*   **System Criticality**: Is it a critical dependency? (+30 points)
*   **Access Level**: Read vs. Admin access? (+10 to +30 points)
*   **Mitigating Controls**: Does the vendor have a SOC 2 report? (-30 points)

### 2. Intelligent Mitigation Mapping
The system doesn't just identify risk; it suggests solutions. It automatically maps risks to industry standard controls:
*   **PII Detected** → Suggests **ISO 27001 A.18.1.4** (Privacy & DPA)
*   **Admin Access** → Suggests **SOC 2 CC6.3** (MFA & SSO)
*   **No SOC 2** → Suggests **VRM.1** (Security Questionnaire)

### 3. Vendor Registry & Dashboard
*   **Risk Heatmap**: Visualize high-risk vendors instantly.
*   **Persistence**: Data is saved locally (`localStorage`), allowing you to track vendors over time.
*   **Detailed Profiles**: Deep-dive pages for every vendor showing their full risk breakdown.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism & Dark Mode)
*   **Icons**: Lucide React
*   **State**: React Context API + LocalStorage

## 🏁 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/vendor-guard.git
    cd vendor-guard
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📸 Screenshots

### Risk Assessment Form
*Input vendor details and see the algorithm work in real-time.*

### Mitigation Plan
*Specific, actionable controls generated automatically.*

## 💡 Why This Project?
This project demonstrates **"Compliance as Code"**. Instead of static policies, we implement risk logic as executable code, ensuring consistency, scalability, and immediate feedback for the security team.
