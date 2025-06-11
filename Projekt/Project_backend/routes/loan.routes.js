const { authJwt } = require("../middleware");
const controller = require("../controllers/loan.controller");

module.exports = function(app) {
  app.post("/api/loans/new", [authJwt.verifyToken], controller.createLoan);
  app.get("/api/loans/myloans", [authJwt.verifyToken], controller.getMyLoans);
  app.post("/api/loans/return", [authJwt.verifyToken], controller.processReturn);
  app.get("/api/loans/overdue", [authJwt.verifyToken, authJwt.isAdmin], controller.getOverdueLoans);
  app.get("/api/loans/all", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllLoans);
};