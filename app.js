/***** MODULE IMPORTS *****/
const express = require("express");
const mongoose = require("mongoose");

/***** APP SETUP *****/
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 3003;
app.set("views");
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/**
 * Purpose: This middleware function logs incoming requests.
 */
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path}`);
  next();
});

/***** ROUTER SETUP *****/
const itemsRouter = require("./routers/itemsRouter");
const warehousesRouter = require("./routers/warehousesRouter");
app.use("/items", itemsRouter);
app.use("/warehouses", warehousesRouter);

app.get("/", (req, res) => {
  res.render('home.pug');
});

// in the case where the path is not recognized
app.use((req, res, next)=>{
  return res.status(404).send("Resource not found!");
})

/***** DB CONNECTION *****/
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

/***** DB DATA MANIPULATION *****/
db.on("error", () => {
  console.log("A connection error occurred.");
});
db.on("open", (err) => {
  if (err) throw err;
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
});
