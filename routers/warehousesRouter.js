/***** MODULE AND MODEL IMPORTS *****/
const express = require("express");
const Warehouse = require("../models/warehouseModel");

/***** ROUTER SETUP *****/
const router = express.Router();

router.get("/", (req, res) => {
  Warehouse.find((err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    res.render("warehouses", { warehouses: result });
    return;
  });
});

router.get("/:id", (req, res) => {
    Warehouse.findById(req.params.id, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.render("warehouse", { warehouse: result });
      return;
    });
  });

/***** EXPORTING ROUTER *****/
module.exports = router;
