import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { register } from "../store/slices/authSlice";
import { clearMessage } from "../store/slices/messageSlice";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { message } = useAppSelector((state) => state.message);
  const dispatch = useAppDispatch();

  useEffect(() => { dispatch(clearMessage()); }, [dispatch]);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessful(false);
    setLoading(true);
    dispatch(register({ username, email, firstname, lastname, password }))
      .unwrap()
      .then(() => { setSuccessful(true); setLoading(false); })
      .catch(() => { setSuccessful(false); setLoading(false); });
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img id="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" className="profile-img-card" style={{margin:"0 auto 10px", display:"block", width:"96px", borderRadius:"50%"}}/>
        <form onSubmit={handleRegister}>
          {!successful && (
            <div>
              <div className="form-group mb-3">
                <label htmlFor="username">Kasutajanimi</label>
                <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
               <div className="form-group mb-3">
                <label htmlFor="firstname">Eesnimi</label>
                <input type="text" className="form-control" value={firstname} onChange={e => setFirstname(e.target.value)} required />
              </div>
               <div className="form-group mb-3">
                <label htmlFor="lastname">Perenimi</label>
                <input type="text" className="form-control" value={lastname} onChange={e => setLastname(e.target.value)} required />
              </div>
               <div className="form-group mb-3">
                <label htmlFor="password">Parool</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <button className="btn btn-primary btn-block w-100" disabled={loading}>
                    {loading && <span className="spinner-border spinner-border-sm"></span>}
                    <span> Registreeru</span>
                </button>
              </div>
            </div>
          )}
          {message && (
            <div className="form-group mt-3">
              <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;