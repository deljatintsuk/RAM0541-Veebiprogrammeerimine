import React, { useState, useEffect } from "react";
import AdminService from "../services/admin.service";
import { IAdminViewUser, IOverdueLoan, IAllLoan, IAllReservation } from "../types";

type TabName = 'overdue' | 'all-loans' | 'reservations' | 'users';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('overdue');
  const [users, setUsers] = useState<IAdminViewUser[]>([]);
  const [overdueLoans, setOverdueLoans] = useState<IOverdueLoan[]>([]);
  const [allLoans, setAllLoans] = useState<IAllLoan[]>([]);
  const [allReservations, setAllReservations] = useState<IAllReservation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setError(null);
    Promise.all([
      AdminService.getAllUsers(),
      AdminService.getOverdueLoans(),
      AdminService.getAllLoans(),
      AdminService.getAllReservations(),
    ]).then(
      ([usersRes, overdueRes, allLoansRes, allReservationsRes]) => {
        setUsers(usersRes.data);
        setOverdueLoans(overdueRes.data);
        setAllLoans(allLoansRes.data);
        setAllReservations(allReservationsRes.data);
      }
    ).catch(err => {
        setError(err.response?.data?.message || "Andmete laadimisel tekkis viga");
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overdue':
        return (
            <table className="table table-striped table-sm">
              <thead><tr><th>Kasutaja</th><th>Raamat</th><th>Tähtaeg</th><th>Päevi üle</th></tr></thead>
              <tbody>{overdueLoans.map(l => <tr key={l.loanid}><td>{l.username}</td><td>{l.title}</td><td>{new Date(l.duedate).toLocaleDateString("et-EE")}</td><td>{l.days_overdue}</td></tr>)}</tbody>
            </table>
        );
      case 'all-loans':
        return (
            <table className="table table-striped table-sm">
              <thead><tr><th>Kasutaja</th><th>Raamat</th><th>Laenutatud</th><th>Tähtaeg</th><th>Tagastatud</th></tr></thead>
              <tbody>{allLoans.map(l => <tr key={l.loanid}><td>{l.user.username}</td><td>{l.edition.work.title}</td><td>{new Date(l.loandate).toLocaleDateString("et-EE")}</td><td>{new Date(l.duedate).toLocaleDateString("et-EE")}</td><td>{l.returndate ? new Date(l.returndate).toLocaleDateString("et-EE") : 'Ei'}</td></tr>)}</tbody>
            </table>
        );
      case 'reservations':
         return (
            <table className="table table-striped table-sm">
              <thead><tr><th>Kasutaja</th><th>Raamat</th><th>Broneeritud</th><th>Staatus</th></tr></thead>
              <tbody>{allReservations.map(r => <tr key={r.reservationid}><td>{r.user.username}</td><td>{r.work.title}</td><td>{new Date(r.reservationdate).toLocaleDateString("et-EE")}</td><td>{r.status}</td></tr>)}</tbody>
            </table>
        );
      case 'users':
        return (
            <table className="table table-striped table-sm">
              <thead><tr><th>ID</th><th>Kasutajanimi</th><th>Email</th><th>Roll</th></tr></thead>
              <tbody>{users.map(u => <tr key={u.userid}><td>{u.userid}</td><td>{u.username}</td><td>{u.email}</td><td>{u.role.rolename}</td></tr>)}</tbody>
            </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Admini töölaud</h3>
      </header>
      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="nav nav-tabs">
        <li className="nav-item"><a className={`nav-link ${activeTab === 'overdue' ? 'active' : ''}`} href="#" onClick={() => setActiveTab('overdue')}>Viivises ({overdueLoans.length})</a></li>
        <li className="nav-item"><a className={`nav-link ${activeTab === 'all-loans' ? 'active' : ''}`} href="#" onClick={() => setActiveTab('all-loans')}>Kõik laenutused ({allLoans.length})</a></li>
        <li className="nav-item"><a className={`nav-link ${activeTab === 'reservations' ? 'active' : ''}`} href="#" onClick={() => setActiveTab('reservations')}>Broneeringud ({allReservations.length})</a></li>
        <li className="nav-item"><a className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} href="#" onClick={() => setActiveTab('users')}>Kasutajad ({users.length})</a></li>
      </ul>

      <div className="tab-content p-3 border border-top-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboardPage;