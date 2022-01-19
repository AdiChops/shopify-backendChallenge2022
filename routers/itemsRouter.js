/***** MODULE AND MODEL IMPORTS *****/
const express = require("express");
const Item = require("../models/itemModel");
const Warehouse = require("../models/warehouseModel");

/***** ROUTER SETUP *****/
const router = express.Router();

/***** HELPER FUNCTIONS *****/
let verifyFields = (body) => {
  errMessage = [];
  if (!body.name) {
    errMessage.push("Name is required");
  }
  if (!body.description) {
    errMessage.push("Description is required");
  }
  if (!body.stock) {
    errMessage.push("Stock is required");
  }
  if (!body.price) {
    errMessage.push("Price is required");
  } else {
    if (isNaN(body.price)) {
      errMessage.push("Price must be a number");
    } else if (parseFloat(body.price) < 0) {
      errMessage("Price must be at least 0.00");
    }
  }
  return errMessage.join(", ");
};

router.get("/", (req, res) => {
  Item.find((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "An error occurred." });
    }
    res.render("items", { inventory: result });
    return;
  });
});

router.get("/new", (req, res)=>{
  Warehouse.find({}, (error, warehouses) => {
    if (error) return res.status(500).send({ message: "An error occurred." });
    return res.render("item", {warehouses});
  });
});

router.get("/:id", (req, res) => {
  Warehouse.find({}, (error, warehouses) => {
    if (error) return res.status(500).send({ message: "An error occurred." });
    Item.findById(req.params.id, (err, result) => {
      if (err) {
        return res.status(500).send({
          message: "An error occurred.",
        });
      }
      res.render("item", { item: result, warehouses });
      return;
    }).populate("warehouseLocations");
  });
});

router.put("/:id", (req, res) => {
  let errMsg = verifyFields(req.body);
  if (!errMsg) {
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
        if (err)
          return res.status(500).send({
            message:
              "An error occurred. There is a possibility of invalid data.",
          });
        res.status(200).send();
      }
    );
  } else {
    return res.status(400).send({ message: errMsg });
  }
});

router.post("/", (req, res) => {
  let errMsg = verifyFields(req.body);
  if (!errMsg) {
    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
      tags: req.body.tags,
      warehouseLocations: req.body.warehouseLocations,
    });
    item.save((err, result) => {
      if (err)
        return res
          .status(500)
          .send({
            message:
              "An error occurred. There is a possibility of invalid data.",
          });
      res.status(201).send(item);
    });
  }
  else{
    return res.status(400).send({ message: errMsg });
  }
});

router.delete("/:id", (req, res) => {
  Item.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) throw err;
    res.status(204).send();
  });
});

/***** EXPORTING ROUTER *****/
module.exports = router;
