const controller = require("../controllers/work.controller");

module.exports = function(app) {
    app.get("/api/works", controller.findAllDetailed);
    app.get("/api/works/search", controller.search);
    app.get("/api/works/:id", controller.findOne);
};