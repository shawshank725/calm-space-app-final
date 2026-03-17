# 🌿 Calm Space App

Welcome to **Calm Space**, a modern mental wellness platform designed to provide a supportive environment for students, peer listeners, and mental health experts. Built with **React Native**, **Expo**, and **Supabase**, Calm Space offers role-specific tools to manage mental well-being effectively.

---

## ✨ Key Features

- 🧘 **Personalized Experience**: Tailored dashboards for Students, Peer Listeners, and Experts.
- 💬 **AI-Powered Chatbot**: Get instant support and resources from our integrated mental health assistant.
- 📊 **Mood Tracking**: Visualize your emotional journey with interactive charts and insights.
- 📅 **Session Management**: Easily book and manage appointments with mental health professionals.
- 🔒 **Secure & Private**: Robust authentication and data protection powered by Supabase.
- 📂 **Resource Library**: Access a curated collection of wellness articles, audios, and videos.

---

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo (v55+), TypeScript
- **State Management**: React Context / Hooks
- **Styling**: Native CSS, React Native Paper
- **Backend / Auth**: Supabase
- **Visuals**: React Native Skia, SVG, Chart Kit
- **AI Integration**: Custom Python-based Chatbot (FastAPI/Simple API)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app (for mobile testing)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shawshank725/calm-space-app-final.git
   cd calm-space-app-final
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Update `app.json` with your Supabase credentials:
   ```json
   "extra": {
     "supabaseUrl": "YOUR_SUPABASE_URL",
     "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
   }
   ```

---

## 🏃 Running the App

### Mobile App (Expo)
To start the Expo development server:
```bash
npm run dev
```
This command runs both the AI chatbot server and the Expo app concurrently.

### AI Chatbot Servers
If you need to run the AI components separately:
- **Simple AI**: `npm run start:ai`
- **Enhanced AI**: `npm run start:ai-enhanced`
- **Production AI**: `npm run production`

### Build & Deploy
- **Android**: `npm run android`
- **iOS**: `npm run ios`

---

## 📂 Project Structure

- `/app`: Root of the Expo Router, contains all screens and navigation logic.
- `/components`: Reusable UI components.
- `/hooks`: Custom React hooks for global logic.
- `/lib`: Supabase client and other utility libraries.
- `/assets`: Images, fonts, and other static resources.
- `/providers`: Context providers for global state.
- `/chatbot`: Python-based AI infrastructure.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*“Providing a safe space for your mental journey.”*
