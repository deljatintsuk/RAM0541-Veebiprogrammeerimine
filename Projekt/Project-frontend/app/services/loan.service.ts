import api from "./api";
import { IMyLoan } from "../types";

const createLoan = (editionid: number) => {
  return api.post("/loans/new", { editionid });
};

const getMyLoans = () => {
  return api.get<IMyLoan[]>("/loans/myloans");
};

const returnLoan = (editionid: number) => {
  return api.post("/loans/return", { editionid });
};

const LoanService = {
  createLoan,
  getMyLoans,
  returnLoan,
};

export default LoanService;