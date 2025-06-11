import React, { useState, useEffect, useCallback } from "react";
import LoanService from "../services/loan.service";
import { IMyLoan } from "../types";

const MyLoansPage: React.FC = () => {
  const [myLoans, setMyLoans] = useState<IMyLoan[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMyLoans = useCallback(() => {
    setLoading(true);
    LoanService.getMyLoans().then(
      (response) => {
        setMyLoans(response.data);
        setLoading(false);
      },
      (error) => {
        const errMsg = error.response?.data?.message || error.message;
        setMessage(errMsg);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    fetchMyLoans();
  }, [fetchMyLoans]);

  const handleReturn = (editionid: number) => {
    setMessage("Tagastan...");
    LoanService.returnLoan(editionid).then(
      (response) => {
        setMessage(response.data.message);
        fetchMyLoans();
      },
      (error) => {
        const errMsg = error.response?.data?.message || error.message;
        setMessage(errMsg);
      }
    );
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Minu laenutused</h3>
      </header>
      {message && <div className="alert alert-info">{message}</div>}
      {loading && <p>Laen...</p>}
      {!loading && myLoans.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Pealkiri</th>
              <th>Laenutatud</th>
              <th>Tähtaeg</th>
              <th>Tegevus</th>
            </tr>
          </thead>
          <tbody>
            {myLoans.map((loan) => (
              <tr key={loan.loanid}>
                <td>{loan.edition.work.title}</td>
                <td>{new Date(loan.loandate).toLocaleDateString("et-EE")}</td>
                <td>{new Date(loan.duedate).toLocaleDateString("et-EE")}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleReturn(loan.edition.editionid)}
                  >
                    Tagasta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>Sul ei ole hetkel aktiivseid laenutusi.</p>
      )}
    </div>
  );
};

export default MyLoansPage;