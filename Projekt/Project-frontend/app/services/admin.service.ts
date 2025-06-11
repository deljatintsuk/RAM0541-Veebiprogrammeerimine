import api from "./api";
import { IAdminViewUser, IOverdueLoan, IAllLoan, IAllReservation } from "../types";

const getAllUsers = () => {
  return api.get<IAdminViewUser[]>("/users/all");
};

const getOverdueLoans = () => {
  return api.get<IOverdueLoan[]>("/loans/overdue");
};

const updateUserRole = (userid: number, roleid: number) => {
    return api.put(`/users/${userid}/role`, { roleid });
};

const getAllLoans = () => {
  return api.get<IAllLoan[]>("/loans/all");
};

const getAllReservations = () => {
  return api.get<IAllReservation[]>("/reservations/all");
};

const AdminService = {
  getAllUsers,
  getOverdueLoans,
  updateUserRole,
  getAllLoans,
  getAllReservations,
};

export default AdminService;