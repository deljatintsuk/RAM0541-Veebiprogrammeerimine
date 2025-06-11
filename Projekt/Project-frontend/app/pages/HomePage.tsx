import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { fetchEditions, searchEditions, updateEditionAvailability } from "../store/slices/editionSlice";
import { setMessage, clearMessage } from "../store/slices/messageSlice";
import LoanService from "../services/loan.service";
import ReservationService from "../services/reservation.service";
import Spinner from "../components/Spinner";
import { IEdition } from "../types";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();

  // Andmed ja olekud tulevad nüüd Reduxist
  const { all: editions, status: editionStatus, error: editionError } = useAppSelector((state) => state.editions);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { message } = useAppSelector((state) => state.message);

  // Lokaalne olek ainult otsingusõna hoidmiseks
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Lae andmed ainult siis, kui neid veel pole
    if (editionStatus === 'idle') {
      dispatch(fetchEditions());
    }
  }, [editionStatus, dispatch]);

  const handleLoan = (editionid: number) => {
    dispatch(setMessage("Laenutan..."));
    LoanService.createLoan(editionid).then(
      (response) => {
        dispatch(setMessage(response.data.message));
        // Uuendame staatust otse Reduxis, ilma uue API päringuta
        dispatch(updateEditionAvailability({ editionid, availability: 'OnLoan' }));
      },
      (error: any) => { dispatch(setMessage(error.response?.data?.message || "Viga laenutamisel")); }
    );
  };
  
  const handleReservation = (workid: number) => {
    dispatch(setMessage("Broneerin..."));
    ReservationService.createReservation(workid).then(
      (response) => {
        dispatch(setMessage(response.data.message));
        // Pärast broneerimist on vaja andmed uuesti laadida, et näha 'currentUserHasReservation' muutust
        dispatch(fetchEditions());
      },
      (error: any) => { dispatch(setMessage(error.response?.data?.message || "Viga broneerimisel")); }
    );
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearMessage());
    dispatch(searchEditions(searchTerm));
  };

  return (
    <div className="page-container">
      <header className="mb-4">
        <h3>Avaleht - Saadaval teosed</h3>
      </header>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Otsi pealkirja, autori või kategooria järgi..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button className="btn btn-primary" type="submit">Otsi</button>
        </div>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
      {editionError && <div className="alert alert-danger mt-3">{editionError}</div>}

      {editionStatus === 'loading' ? (
        <Spinner />
      ) : (
        <div className="row">
          {editions.map((edition: IEdition) => {
            const canReserve = edition.availability !== 'Available' && !edition.currentUserHasLoan && !edition.currentUserHasReservation;
            return (
                <div key={edition.editionid} className="col-md-4 col-lg-3 mb-4">
                  <div className="card h-100 book-card">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{edition.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{edition.authors}</h6>
                      <p className="card-text mb-2"><small className="text-muted">{edition.subjects || 'Kategooria puudub'}</small></p>
                      <div className="mt-auto">
                        <p className="card-text mb-2">Saadavus: <strong>{edition.availability}</strong></p>
                        {isLoggedIn && edition.availability === 'Available' && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleLoan(edition.editionid)}>Laenuta</button>
                        )}
                        {isLoggedIn && canReserve && (
                           <button className="btn btn-warning btn-sm" onClick={() => handleReservation(edition.workid)}>Broneeri</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;