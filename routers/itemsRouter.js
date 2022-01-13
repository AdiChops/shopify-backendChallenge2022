/***** MODULE AND MODEL IMPORTS *****/
const express = require("express");
const Item = require("../models/itemModel");

/***** ROUTER SETUP *****/
const router = express.Router();

router.get("/", (req, res) => {
  Item.find((err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    res.render("items", { inventory: result });
    return;
  });
});

router.get("/:id", (req, res) => {
    Item.findById(req.params.id, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.render("item", { item: result });
      return;
    }).populate("warehouseLocations");
  });

/***** EXPORTING ROUTER *****/
module.exports = router;
