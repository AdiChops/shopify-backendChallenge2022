/***** MODULE AND MODEL IMPORTS *****/
const express = require("express");
const Item = require("../models/itemModel");
const Warehouse = require("../models/warehouseModel");

/***** ROUTER SETUP *****/
const router = express.Router();

/***** HELPER FUNCTIONS *****/

/**
 * Purpose: This function validate the request body before inserting to the database.
 * @param {*} body The JSON request body which contains the values submitted by the user
 * @param {bool} isNew Flag for if it's a new insertion or an edit.
 * @returns an error message if there are errors that exist within the fields, blank otherwise.
 */
let verifyFields = (body, isNew = true) => {
  errMessage = [];
  if(isNew){
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
    }
  }
  else{
    if (body.name === "") {
      errMessage.push("Name is required");
    }
    if (body.description === "") {
      errMessage.push("Description is required");
    }
  }
  if(body.price || body.price === ""){
    if (body.price === "" || isNaN(body.price)) {
      errMessage.push("Price must be a number");
    } else if (parseFloat(body.price) < 0) {
      errMessage("Price must be at least 0.00");
    }
  }
  if(body.stock || body.stock === ""){
    if (body.stock === "" || isNaN(body.stock)) {
      errMessage.push("Stock must be a number");
    } else if (parseInt(body.stock) < 0) {
      errMessage("Stock must be at least 0");
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
    return res.render("items", { inventory: result });
  });
});

router.get("/new", (req, res) => {
  Warehouse.find({}, (error, warehouses) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send({message: "An error occurred."});
    }
    return res.render("item", { warehouses });
  });
});

router.get("/:id", (req, res) => {
  Warehouse.find({}, (error, warehouses) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send({message: "An error occurred."});
    }
    Item.findById(req.params.id, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({message: "An error occurred."});
      }
      if(!result)
        return res.status(404).send("Item not found");
      return res.render("item", { item: result, warehouses });
    }).populate("warehouseLocations");
  });
});

router.put("/:id", (req, res) => {
  let errMsg = verifyFields(req.body, false);
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
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send({message: "An error occurred. There is a possibility of invalid data."});
        }
        return res.status(200).send();
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
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({message: "An error occurred. There is a possibility of invalid data."});
      }
      return res.status(201).send(item);
    });
  } else {
    return res.status(400).send({ message: errMsg });
  }
});

router.delete("/:id", (req, res) => {
  Item.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({message: "An error occurred. There is a possibility of invalid data."});
    }
    return res.status(204).send();
  });
});

/***** EXPORTING ROUTER *****/
module.exports = router;
