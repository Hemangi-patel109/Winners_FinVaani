# 💸 Finvaani: Your AI-Powered Personal Finance Assistant  
**Built for Fi Money's MCP Hackathon**

---

## 🧠 Challenge We Solved

> *“AI today can answer general finance questions — but not yours.”*

Your financial life is spread across banks, SIPs, loans, credit cards, etc. Even the smartest AI can’t reason without access to real data. But now, with Fi Money's MCP server, we’ve created the first **AI-native financial assistant** that understands *your* money like a pro — securely, privately, and intelligently.

---

## 🎯 Objective

Build an AI-powered assistant using Fi’s MCP Server that:

- 🤝 Uses real-time financial data from Fi MCP
- 🧠 Understands natural language queries (text & voice)
- 📊 Offers deep financial insights, simulations, and personalized planning
- 🔒 Gives users full control of their data
- 📈 Goes beyond budgeting to enable smarter wealth management

---

## 🧩 Modules Overview

### ✅ Main Functional Modules (Hackathon Submission)

1. ### 🔊 Bot Interaction Module (Chat + Voice)
   - Voice Input in English & Hindi (Google Speech API)
   - Gemini-powered chat for human-like interaction

2. ### 🔗 Real-Time Financial Data Connector (Fi MCP)
   - Fetches: Assets, Liabilities, Loans, SIPs, EPF, Credit Score
   - Returns clean structured JSON
   - Example: “What’s my net worth?” → Data pulled via MCP → Gemini responds

3. ### 🧠 AI Layer (Gemini + Vertex AI)
   - Scenario simulation: “What if I invest ₹10K/month?”
   - SIP analysis: “Which SIPs are underperforming?”
   - Goal planning: “Save ₹1L for Diwali in 10 months”

4. ### 📑 Reports Section
   - Auto-generated weekly/monthly reports
   - Insights like:
     - Top spending categories
     - SIP growth charts
     - Loan breakdown
   - Export as PDF/CSV

5. ### 📊 Dashboard & Visualization
   - Built using Google Charts / D3.js
   - Graphs: Net worth, SIP performance, Loan EMI, Monthly expenses
   - Real-time dynamic updates

6. ### 📢 Smart Nudges & Notifications
   - Example nudges:
     - “You're spending 30% more on food this week.”
     - “SBI SIP returned less than benchmark.”
     - “EMI due tomorrow!”

7. ### 🎯 Goal Planner Module
   - Set goals like: “Save ₹2L for wedding in 1 year”
   - Tracks progress visually on dashboard

---

## 🚀 Advanced (Future-Ready) Modules

8. ### 📉 Anomaly Detector + Risk Advisor *(Vertex AI based)*
   - Flags abnormal spending or income
   - Example: “Credit card bill jumped 60% from last month”
   - Suggests rebalancing risky portfolios

9. ### 🧮 Financial Health Score Engine
   - Uses Fi MCP data to calculate a personalized score based on:
     - Savings consistency
     - Investment diversification
     - EMI burden
   - Gives actionable improvement tips

10. ### 🌱 ESG & Green Investment Tracker
   - Tracks how “green” your investment portfolio is
   - Suggests eco-friendly fund alternatives
   - Encourages sustainable wealth building

---

## 🏗️ Tech Stack

- **Fi MCP Server** – Structured financial data source
- **Gemini / Vertex AI** – NLP, AI reasoning, scenario simulation
- **Google Speech API** – Voice input in English + Hindi
- **Flask / Node.js** – Backend service layer
- **Google Charts / D3.js** – Dashboard visualization
- **PDF/CSV Export** – For reports

---

## 🔐 Privacy & Control

- Data is user-controlled and never stored without permission
- Exportable insights (PDF/CSV)
- Extensible to other models or tools using secure APIs

---

## 💡 What Makes It Special?

Unlike basic budgeting tools, **Finvaani**:
- Understands your goals in your voice
- Connects to real financial data securely
- Thinks like a personal financial coach
- Supports Indian users in multiple languages
- Grows smarter with you

---

## 📌 Future Scope

- ✅ UPI/Subscription bill scanning
- ✅ Auto tax filing suggestions (India-specific)
- ✅ Family goal sharing
- ✅ Offline agent mode (Edge AI)
- ✅ Emotion-aware coaching (based on voice tone)

---

## 🙌 Built With ❤️ by Winners

For Fi Money x Google Hackathon 2025
