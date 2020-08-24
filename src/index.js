const express = require("express"),
  cors = require("cors"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  mainRoute = require("./routes/main");

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api", mainRoute);

const PORT = process.env.PORT || 8080;

// handle 404

app.use((req, res) => {
  res.status(404).json({ error: true, message: "Route unavailable" });
});

app.listen(() => {
  console.info(`Listening on PORT ${PORT}`);
});
