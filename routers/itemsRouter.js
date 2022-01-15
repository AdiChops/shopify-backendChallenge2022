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

router.put("/:id", (req, res) => {
  let it = new Item({ _id: req.params.id });
  Item.updateOne(
    { _id: req.params.id },
    {
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
      tags: req.body.tags,
      warehouseLocations: req.body.warehouseLocations,
    },
    (err, result) => {
      if (err) throw err;
      res.status(200).send();
    }
  );
});

/***** EXPORTING ROUTER *****/
module.exports = router;
