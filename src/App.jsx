import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Connexion à mon app</h1>
        <Routes>
          {/* Route pour le formulaire de connexion */}
          <Route path="/login" element={<LoginForm />} />
          {/* Route pour le formulaire d'inscription */}
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
