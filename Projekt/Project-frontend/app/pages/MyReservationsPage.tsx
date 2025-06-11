import React, { useState, useEffect, useCallback } from "react";
import ReservationService from "../services/reservation.service";
import { IReservation } from "../types";

const MyReservationsPage: React.FC = () => {
  const [myReservations, setMyReservations] = useState<IReservation[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // PARANDATUD OSA: Siin on nüüd funktsiooni sisu olemas
  const fetchMyReservations = useCallback(() => {
    setLoading(true); // Nüüd on kasutusel
    ReservationService.getMyReservations().then(
      (response) => {
        setMyReservations(response.data); // Nüüd on kasutusel
        setLoading(false);
      },
      (error: any) => {
        const errMsg = error.response?.data?.message || error.message;
        setMessage(errMsg);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  const handleAction = (action: 'confirm' | 'decline' | 'cancel', reservationid: number) => {
    setMessage("Töötlen...");
    let promise;
    if (action === 'confirm') promise = ReservationService.confirmReservation(reservationid);
    else if (action === 'decline') promise = ReservationService.declineReservation(reservationid);
    else promise = ReservationService.cancelReservation(reservationid);

    promise.then(
      (response) => {
        setMessage(response.data.message);
        fetchMyReservations();
      },
      (error: any) => {
        setMessage(error.response?.data?.message || "Viga");
      }
    );
  };
  
  const getStatusText = (status: string) => {
      const statusMap: { [key: string]: string } = {
          'Active': 'Ootel',
          'PendingConfirmation': 'Ootab kinnitust',
          'Fulfilled': 'Täidetud',
          'Cancelled': 'Tühistatud',
          'Expired': 'Aegunud'
      };
      return statusMap[status] || status;
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Minu broneeringud</h3>
      </header>
      {message && <div className="alert alert-info">{message}</div>}
      {loading && <p>Laen...</p>}
      {!loading && myReservations.length > 0 ? (
        <table className="table">
          <thead><tr><th>Pealkiri</th><th>Broneeritud</th><th>Staatus</th><th>Tegevus</th></tr></thead>
          <tbody>
            {myReservations.map((reserv) => (
              <tr key={reserv.reservationid}>
                <td>{reserv.work.title}</td>
                <td>{new Date(reserv.reservationdate).toLocaleDateString("et-EE")}</td>
                <td>
                    {getStatusText(reserv.status)}
                    {reserv.status === 'PendingConfirmation' && reserv.offer_expires_at &&
                        <small className="d-block text-muted">Aegub: {new Date(reserv.offer_expires_at).toLocaleString("et-EE")}</small>
                    }
                </td>
                <td>
                  {reserv.status === 'PendingConfirmation' && (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={() => handleAction('confirm', reserv.reservationid)}>Kinnita laenutus</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleAction('decline', reserv.reservationid)}>Loobu</button>
                    </>
                  )}
                  {reserv.status === 'Active' && (
                      <button className="btn btn-sm btn-warning" onClick={() => handleAction('cancel', reserv.reservationid)}>Tühista</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>Sul ei ole hetkel aktiivseid broneeringuid.</p>
      )}
    </div>
  );
};

export default MyReservationsPage;