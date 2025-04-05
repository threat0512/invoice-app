# 📄 Invoice Compliance Web App

A full-stack invoice management system that allows users to upload invoices and automatically checks them for compliance against Australian invoicing laws. Built using **React**, **Node.js**, **TypeScript**, and **MongoDB**.

---

## 🚀 Features

- Upload and validate invoices against **Australian tax law**
- Supports multiple formats: **PDF**, **XML**, and **JSON**
- Structured feedback with detailed error messages
- User authentication and session management
- Subscription-based access (Free, Premium, Team)
- Responsive UI with Material UI and custom components
- Secure backend with file sanitization and input validation

---

## 🛠 Tech Stack

**Frontend:**
- React
- TypeScript
- Material UI
- React Router

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB
- PDF & XML parsing libraries

**Tools:**
- Vite
- Axios
- JWT (JSON Web Tokens)

---

## 🧪 Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/invoice-compliance-app.git
cd invoice-compliance-app

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Running the App

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---


## 📌 Future Enhancements

- Team collaboration tools
- Exportable compliance reports
- Cloud deployment (Render / Vercel / Railway)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgments

- [ATO invoicing guidelines](https://www.ato.gov.au/)
- Open-source libraries for PDF/XML parsing
