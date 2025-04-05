import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AuthContextProvider from "./context/AuthContextProvider";
import ThankYouPage from "./components/ThankYouPage";


function App() {
  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/*" element={<DashboardPage />} />
          <Route path="/mockUID" element={<div>your pdf couldn't be generated :(</div>} />
          <Route path="/thankyou" element={<ThankYouPage/>}></Route>
          <Route path="*" element={<div>404 NOT FOUND</div>}></Route>
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
