/***** MODULE IMPORTS *****/
const express = require("express");
const mongoose = require("mongoose");

/***** APP SETUP *****/
const app = express();
const PORT = process.env.PORT || 3001;
app.set("views");
app.set("view engine", "pug");
app.use(express.static("public"));

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

/***** DB CONNECTION *****/
mongoose.connect("mongodb://localhost:27017/inventorySystem", {
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
