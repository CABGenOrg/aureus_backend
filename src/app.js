const path = require("path");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const oneHour = 3600000;

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://cabgen.fiocruz.br";
// Lista de orígenes permitidos
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:3000", // Agrega aquí otros orígenes permitidos si es necesario
];

// Configuración del middleware de CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// connect to db
mongoose.connect("mongodb://localhost/sgbmi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((db) => console.log("Db Connected"))
  .catch((err) => console.log(err));

//importando rutas
const indexRoutes = require("./routes/index");
const contactRoute = require("./routes/contact");

// Get session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error(
    "ERRO DE CONFIGURAÇÃO: SESSION_SECRET não está definido. Verifique o arquivo .env."
  );
}

// settings
app.use(cors(corsOptions));
app.set("port", PORT);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("debugMode", true);

//middlewares
app.use(
  session({ secret: sessionSecret, saveUninitialized: false, resave: false })
);
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: 999999, extended: true }));
app.use(fileUpload({ createParentPath: true }));
app.use(express.static(__dirname + "/views/static", { maxAge: oneHour }));

//routes
app.use("/", indexRoutes);
app.use("/admin/contact", contactRoute);

//starting the server
app.listen(app.get("port"), "localhost", () => {
  console.log(`Server on port ${app.get("port")}`);
});
