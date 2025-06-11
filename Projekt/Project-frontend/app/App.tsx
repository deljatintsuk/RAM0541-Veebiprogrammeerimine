import { Routes, Route, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from './hooks/redux-hooks';
import { logout } from './store/slices/authSlice';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import MyLoansPage from "./pages/MyLoansPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => { dispatch(logout()); };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">Raamatukogu</Link>
        <div className="navbar-nav me-auto">
          <li className="nav-item"><Link to={"/"} className="nav-link">Avaleht</Link></li>
          {isLoggedIn && (<li className="nav-item"><Link to={"/my-loans"} className="nav-link">Minu laenutused</Link></li>)}
          {isLoggedIn && (<li className="nav-item"><Link to={"/my-reservations"} className="nav-link">Minu broneeringud</Link></li>)}
          {user?.role === 'Admin' && (<li className="nav-item"><Link to={"/admin"} className="nav-link">Admini töölaud</Link></li>)}
        </div>
        {isLoggedIn ? (
          <div className="navbar-nav ms-auto">
            <li className="nav-item"><Link to={"/profile"} className="nav-link">{user?.username}</Link></li>
            <li className="nav-item"><a href="/login" className="nav-link" onClick={handleLogout}>Logi välja</a></li>
          </div>
        ) : (
          <div className="navbar-nav ms-auto">
            <li className="nav-item"><Link to={"/login"} className="nav-link">Logi sisse</Link></li>
            <li className="nav-item"><Link to={"/register"} className="nav-link">Registreeru</Link></li>
          </div>
        )}
      </nav>
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-loans" element={<ProtectedRoute><MyLoansPage /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<ProtectedRoute><MyReservationsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;