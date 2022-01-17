/***** MODULE AND MODEL IMPORTS *****/
const express = require("express");
const Item = require("../models/itemModel");
const Warehouse = require("../models/warehouseModel");

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
  Warehouse.find({}, (error, warehouses)=>{
    if(error) throw error;
    Item.findById(req.params.id, (err, result) => {
      if (err) {
        console.log(err);
        throw err;
      }
      res.render("item", { item: result, warehouses });
      return;
    }).populate("warehouseLocations");
  })

});

router.put("/:id", (req, res) => {
  console.log(req.body.tags);
  console.log(req.body);
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

router.post("/", (req, res) => {
  let item = new Item({
    name: req.body.name,
    description: req.body.description,
    stock: req.body.stock,
    price: req.body.price,
    tags: req.body.tags,
    warehouseLocations: req.body.warehouseLocations,
  });
  item.save((err, result) => {
    if (err) throw err;
    res.status(201).send();
  });
});

router.delete("/:id", (req, res) => {
  Item.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) throw err;
    res.status(204).send();
  });
});

/***** EXPORTING ROUTER *****/
module.exports = router;
