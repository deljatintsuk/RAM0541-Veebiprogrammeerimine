import api from "./api";
import { IUser } from "../types";

const register = (username: string, email: string, firstname: string, lastname: string, password: string) => {
  return api.post("/auth/signup", { username, email, firstname, lastname, password });
};

const login = (username: string, password: string) => {
  return api.post<IUser>("/auth/signin", { username, password })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const AuthService = { register, login, logout };
export default AuthService;