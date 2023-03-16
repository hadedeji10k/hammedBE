// REQUIRE MODULES
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const paginate = require("express-paginate");
const axios = require("axios").default;

const { connect } = require("mongoose");

const router = require("./routes/index");

const app = express();

// EXPRESS MIDDLEWRARES SETUP
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// To accept JSON objects
app.use(express.json());

// Middleware setup for pagination
app.use(paginate.middleware(process.env.LIMIT, process.env.MAX_LIMIT));

app.use(router);

const startServer = async () => {
  try {
    await connect(process.env.MONGO_DB)
      .then(() => {
        console.log(`Database connected`);
        app.listen(process.env.PORT || 3001, () => {
          console.log(`Server running on port ${process.env.PORT}`);
        });
      })
      .catch(() => {
        console.log(`Database not connected`);
        console.log(`Server not started`);
        process.exit(1);
      });
  } catch (err) {
    console.log(err);
    startServer();
  }
};

app.get("/", (req, res) => {
  console.log("This is the home route");
  res.send("Welcome to the Home route of The News API");
});

startServer();
