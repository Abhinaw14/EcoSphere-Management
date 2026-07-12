# 🌍 EcoSphere Management Platform

EcoSphere is a comprehensive Environmental, Social, and Governance (ESG) management platform designed to help modern organizations track their sustainability impact, engage employees through gamification, and maintain strict compliance with governance policies.

## 🚀 Features

### 🌱 Environmental Impact Tracking
- **Interactive Carbon Footprint Map**: Visualize office locations globally with live water usage and carbon offset data.
- **Dynamic Dashboards**: Track and visualize real-time carbon, energy, water, and waste metrics.
- **Goal Management**: Set actionable environmental targets and monitor progress.
- **Carbon Transactions**: Record and track carbon offset purchases.

### 👥 Social & CSR (Corporate Social Responsibility)
- **Volunteer Initiatives**: Manage community service events (e.g., Beach Cleanups).
- **Participation Tracking**: Log and track employee volunteer hours.

### ⚖️ Governance & Compliance
- **Policy Management**: Track active corporate policies and guidelines.
- **Compliance Audits**: Schedule, log, and review department-level compliance records and security audits.

### 🎮 Gamification & Engagement
- **Virtual Forest**: Every 500 XP earned by the company plants a beautiful, interactive animated tree in the virtual forest.
- **Eco-Challenges**: Participate in sustainability challenges to earn XP.
- **Badges**: Unlock visual achievements for hitting sustainability milestones.
- **Rewards Marketplace**: Redeem earned XP for real-world rewards (e.g., Company Swag, Extra PTO) complete with fun confetti celebrations!

### 🤖 ECObot Assistant
- Built-in AI chat support to answer queries, guide users, and interact with the platform seamlessly.

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Framer Motion, React Query, React Simple Maps, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM.
- **Database**: PostgreSQL.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhinaw14/EcoSphere-Management.git
   cd EcoSphere-Management
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup:**
   Create a `.env` file in the `backend` directory with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ecosphere?schema=public"
   PORT=5000
   JWT_SECRET="your_super_secret_jwt_key"
   ```

5. **Database Setup & Seeding:**
   From the `backend` directory, run the migrations and seed the database with comprehensive dummy data:
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. **Start the Application:**
   Open two terminal windows.
   - Terminal 1 (Backend): `cd backend && npm run dev`
   - Terminal 2 (Frontend): `cd frontend && npm run dev`

7. **Login:**
   Access the dashboard at `http://localhost:5173`. 
   - **Email:** `admin@ecosphere.com`
   - **Password:** `password123`

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the MIT License.
