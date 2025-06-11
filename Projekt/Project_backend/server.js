require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models");
const config = require('./config');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync()
  .then(() => { console.log("Database synced successfully."); })
  .catch((err) => { console.log("Failed to sync db: " + err.message); });

app.get("/", (req, res) => { res.json({ message: "Welcome to the library backend." }); });

require('./routes/auth.routes')(app);
require('./routes/loan.routes')(app);
require('./routes/work.routes')(app);
require('./routes/user.routes')(app);
require('./routes/reservation.routes')(app);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});