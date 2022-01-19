/***** MODULE AND MODEL IMPORTS *****/
const mongoose = require("mongoose");
const Item = require("./models/itemModel");
const Warehouse = require("./models/warehouseModel");
require('dotenv').config()

/***** OBJECT INIT *****/
let warehouses = [
  new Warehouse({
    streetNumber: "123",
    streetName: "Wilson St.",
    city: "Ottawa",
    province: "ON",
    postalCode: "K5N 7K8",
    phone: "613-335-5687",
    country: "CA"
  }),
  new Warehouse({
    streetNumber: "5387",
    streetName: "Thompson Rd.",
    city: "Toronto",
    province: "ON",
    postalCode: "M5K 6P1",
    phone: "416-543-2485",
    country: "CA"
  }),
];

let items = [
  new Item({
    name: "Bicycle",
    description: "Transportation device that requires pedaling.",
    stock: 0,
    price: 342.79,
    tags: ["exercise", "transportation", "adventure", "outdoors"],
  }),
  new Item({
    name: "Camera",
    description: "Device to capture the moment.",
    stock: 12,
    price: 120.79,
    tags: ["technology", "photography", "media"],
    warehouseLocations: [warehouses[0]._id, warehouses[1]._id],
  }),
  new Item({
    name: "Basketball",
    description: "An essential to play basketball.",
    stock: 15,
    price: 14.5,
    warehouseLocations: [warehouses[0]._id],
  }),
];

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

  db.dropDatabase(function (error) {
    if (error) {
      console.log("An error occurred while dropping the database.");
    } else {
      console.log("Data was cleared.");
    }
    Warehouse.insertMany(warehouses, function (err, res) {
      if (err) throw err;
      console.log("Warehouses were inserted.");
      Item.insertMany(items, function (err, result) {
        if (err) throw err;
        console.log("Items were inserted.");
        process.exit();
      });
    });
  });
});
