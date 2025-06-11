import api from "./api";
import { IReservation } from "../types";

const createReservation = (workid: number) => {
    return api.post("/reservations/new", { workid });
};

const getMyReservations = () => {
    return api.get<IReservation[]>("/reservations/my");
};

const cancelReservation = (reservationid: number) => {
    return api.delete(`/reservations/${reservationid}/cancel`);
};

const confirmReservation = (reservationid: number) => {
    return api.post(`/reservations/${reservationid}/confirm`);
};

const declineReservation = (reservationid: number) => {
    return api.post(`/reservations/${reservationid}/decline`);
};

const ReservationService = {
    createReservation,
    getMyReservations,
    cancelReservation,
    confirmReservation,
    declineReservation
};

export default ReservationService;