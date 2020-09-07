const express = require("express"),
  cors = require("cors"),
  helmet = require("helmet"),
  mongoose = require("mongoose"),
  morgan = require("morgan"),
  mainRoute = require("./routes/main"),
  appRoute = require("./routes/app");

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

//connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info("Database successfully connected");
  })
  .catch((error) => console.log(error));

// routes
app.use("/api", mainRoute);
app.use("/app", appRoute);

const PORT = process.env.PORT || 8080;

// handle 404

app.use((req, res) => {
  res.status(404).json({ error: true, message: "Route unavailable" });
});

app.listen(PORT, () => {
  console.info(`Listening on PORT ${PORT}`);
});
