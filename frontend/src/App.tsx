import { Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from "./pages/Home";
import LoginScreen from "./pages/auth";import AdminLayout from "./pages/admin/AdminLayout";
'./pages/auth'

function App() {
  // Fonction de connexion
  const handleLogin = () => {
    console.log('Connexion réussie');
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<LoginScreen onLogin={handleLogin} />} />
      <Route path="/adminLayout" element={<AdminLayout />} />
    </Routes>
  );
}

export default App;