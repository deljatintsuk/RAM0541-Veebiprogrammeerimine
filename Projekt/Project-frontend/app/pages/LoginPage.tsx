import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { login } from "../store/slices/authSlice";
import { clearMessage } from "../store/slices/messageSlice";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { message } = useAppSelector((state) => state.message);
  
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    dispatch(login({ username, password }))
      .unwrap()
      .then(() => { navigate("/profile"); })
      .catch(() => { setLoading(false); });
  };

  if (isLoggedIn) { return <Navigate to="/profile" />; }

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="username">Kasutajanimi</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Parool</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block w-100" disabled={loading}>
              {loading && <span className="spinner-border spinner-border-sm"></span>}
              <span> Logi sisse</span>
            </button>
          </div>
          {message && (
            <div className="form-group mt-3">
              <div className="alert alert-danger" role="alert">{message}</div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;