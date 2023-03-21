// REQUIRE MODULES
require("dotenv").config();

const cors = require("cors");

// Express
const express = require("express");

// Mongoose
const { connect } = require("mongoose");

const router = require("./routes/index");

const app = express();

// EXPRESS MIDDLEWRARES SETUP
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// To accept JSON objects
app.use(express.json());

app.use(router);

// Function for starting the express server
const startServer = async () => {
  try {
    // Connecting to database
    await connect(process.env.MONGO_DB)
      .then(() => {
        console.log(`Database connected`);
        // Starting the server
        app.listen(process.env.PORT || 3001, () => {
          console.log(`Server running on port ${process.env.PORT}`);
        });
      })
      .catch(() => {
        // Database not connected
        console.log(`Database not connected`);
        // Server not started
        console.log(`Server not started`);
        // exit process when database is not connected
        process.exit(1);
      });
  } catch (err) {
    console.log(err);
    // Retry starting the server
    startServer();
  }
};

// Getting the home route
app.get("/", (req, res) => {
  console.log("This is the home route");
  res.send("Welcome to the Home route of The News API");
});

startServer();
