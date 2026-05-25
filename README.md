# ALFLIX - Futuristic Restaurant Experience

ALFLIX is a high-end, futuristic restaurant application built with React, Tailwind CSS, and Firebase. It features cinematic animations, a real-time ordering system integrated with WhatsApp, and an AI-powered menu recommender.

## 🚀 Features

- **Cinematic UI**: Immersive dark theme with neon accents and fluid motion transitions.
- **AI Chef**: Intelligent menu recommendations powered by Google Gemini.
- **Real-time Order Tracking**: Orders are synced to Firebase Firestore and managed via an Admin "Overlord Console".
- **WhatsApp Integration**: Orders are seamlessly pushed to the restaurant's WhatsApp for fulfillment.
- **Admin Arsenal**: Full control over menu items and mission (order) statuses.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion.
- **Backend**: Express.js server (as Vite middleware).
- **Database**: Firebase Firestore.
- **Authentication**: Firebase Auth.
- **AI**: Google Gemini API via `@google/genai`.

## 📦 Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd alflix
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root with the following:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_id
   ```

4. **Run in development**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📜 License

MIT
