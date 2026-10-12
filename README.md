# WheelOnPalm (Nepal Automotive Service Platform)

> "Your Vehicle. Your Services. All in Your Palm."

WheelOnPalm is an all-in-one vehicle ownership, digital garage, and automotive maintenance platform engineered for Nepal. It connects vehicle owners with verified multi-brand workshops, 24/7 roadside assistance rescue, bluebook renewal alerts, and genuine OEM spare parts.

---

## 1. Key Features

- **Digital Garage**: Register and track multiple motorcycles, scooters, cars, SUVs, and EVs with Nepal Department of Transport Management (DOTM) plate numbers, odometer logs, and masked chassis/engine numbers.
- **Nepal Bluebook & Tax Reminders**: Automated expiration tracking for *Savari Darta Pramanpatra* (Bluebook), *Sawari Kar* (Annual Vehicle Road Tax), Motor Insurance, and *Green Sticker* emission certificates with 30, 7, and 1-day advance warning calculations.
- **Verified Workshop Booking**: 10-step guided booking wizard with transparent estimated costs in Nepalese Rupees (NPR), appointment bay time slots, and valet doorstep pickup/return options.
- **24/7 Roadside Rescue (SOS)**: Emergency breakdown dispatch for punctures, battery jump-starts, flatbed towing, and EV roadside recovery. Direct one-tap dialers for Nepal Traffic Police (`103`) and Police Emergency (`100`).
- **OEM Spare Parts Catalog**: Direct parts directory featuring verified suppliers in Teku, Kupandole, and Tinkune with vehicle compatibility filters and direct inquiry forwarding.
- **Multi-Role Access Control (RBAC)**:
  - **Customer / Vehicle Owner**: Default role for vehicle tracking and service reservations.
  - **Workshop Provider**: Service appointment management, lift inspection logs, and billing summaries.
  - **Roadside Rescuer**: Emergency patrol dispatches and live status tracking.
  - **Platform Administrator**: Operational oversight, audit logs, and provider application vetting.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion.
- **Routing**: React Router DOM (protected route wrappers & role guards).
- **Backend Architecture**: Firebase Authentication (Email/Password, Email Verification), Cloud Firestore (ABAC rules), Firebase Storage (user-isolated vaults), and Firebase Hosting.
- **Timezone & Currency**: `Asia/Kathmandu` localized formatting & Nepalese Rupees (`NPR`).

---

## 3. Step-by-Step Firebase Setup & Connection

When launching to production or connecting your own Firebase project:

### Step 1: Create a Firebase Project
1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `wheelonpalm-nepal`.
3. Disable Google Analytics (optional) and create the project.

### Step 2: Enable Authentication
1. Go to **Build > Authentication > Sign-in method**.
2. Click **Email/Password** and enable it.
3. In **Templates**, customize the verification email and password reset sender settings.

### Step 3: Create Firestore Database
1. Go to **Build > Firestore Database > Create database**.
2. Choose **Start in production mode**.
3. Select your preferred Cloud region (e.g., `asia-south1` or `asia-east1`).

### Step 4: Enable Firebase Storage
1. Go to **Build > Storage > Get started**.
2. Start in **Production mode**.

### Step 5: Add Web App Credentials
1. In Project Overview, click the **Web icon (`</>`)** to register a web app.
2. Copy the Firebase configuration keys and add them to your `.env` or production environment:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="wheelonpalm-nepal.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="wheelonpalm-nepal"
   VITE_FIREBASE_STORAGE_BUCKET="wheelonpalm-nepal.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

### Step 6: Deploy Security Rules & Indexes
Install the Firebase CLI and deploy the included configuration:
```bash
npm install -g firebase-tools
firebase login
firebase use wheelonpalm-nepal
firebase deploy --only firestore:rules,storage,hosting
```

---

## 4. Testing & Review Personas

The application includes an in-app **Persona Switcher** in the top navigation bar so reviewers can instantly test all four roles without modifying database records:

1. **Customer**: Test registering a vehicle, scheduling a workshop booking, submitting a roadside SOS request, and adding a bluebook expiry.
2. **Workshop Provider**: Switch role to view the incoming appointment bay queue, adjust status to `In Progress (On Lift)`, and add technician inspection notes.
3. **Roadside Rescuer**: Monitor emergency requests and dispatch status.
4. **Platform Administrator**: Access the admin console to review pending workshop credentials, inspect security audit trails, and oversee all active dispatches.

---

## 5. Security & Privacy Guarantees

- **Zero-Trust ABAC**: Security rules enforce that customers can read and write only their own vehicles, documents, and bookings.
- **Anti-Privilege Escalation**: User role fields cannot be modified via client-side profile updates. Role elevations require verified administrative approval.
- **Sensitive Identifier Masking**: Chassis and engine numbers are masked (`MALC••••••••9283`) by default across summary cards to safeguard against shoulder-surfing and automated scraping.
- **Emergency Disclaimer**: Prominently informs drivers that digital roadside SOS connects to mechanics and tow operators, and does not replace Nepal national accident helplines (`103` / `100`).
