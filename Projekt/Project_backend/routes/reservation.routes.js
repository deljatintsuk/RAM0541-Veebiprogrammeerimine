const { authJwt } = require("../middleware");
const controller = require("../controllers/reservation.controller");

module.exports = function(app) {
  app.post("/api/reservations/new", [authJwt.verifyToken], controller.createReservation);
  app.get("/api/reservations/my", [authJwt.verifyToken], controller.getMyReservations);
  app.delete("/api/reservations/:reservationid/cancel", [authJwt.verifyToken], controller.cancelReservation);
  app.get("/api/reservations/all", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllReservations);
  app.post("/api/reservations/:reservationid/confirm", [authJwt.verifyToken], controller.confirmReservation);
  app.post("/api/reservations/:reservationid/decline", [authJwt.verifyToken], controller.declineReservation);
};