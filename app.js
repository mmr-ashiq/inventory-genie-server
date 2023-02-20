const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bycrpt = require("bcryptjs");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db/db.connection");
// const { PORT } = require("./src/config/server.config");
const routes = require("./src/modules/core/rootRouter");

dotenv.config({ path: "./.env" });

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("common"));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// routes
app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

connectDB();

// const setupAndStartServer = async () => {
//   const app = express();

//   app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: true }));

//   app.listen(PORT, async () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// };

// setupAndStartServer();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`
  );
});
