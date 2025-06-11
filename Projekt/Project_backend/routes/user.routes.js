const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  // Kaitstud marsruut kõikide kasutajate saamiseks
  app.get(
    "/api/users/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );
};