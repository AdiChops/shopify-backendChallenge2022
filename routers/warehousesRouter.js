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

  
router.put("/:id", (req, res) => {
  Warehouse.updateOne(
    { _id: req.params.id },
    {
      streetNumber: req.body.streetNumber,
      streetName: req.body.streetName,
      city: req.body.city,
      province: req.body.province,
      postalCode: req.body.postalCode,
      country: req.body.country,
      phone: req.body.phone
    },
    (err, result) => {
      if (err) throw err;
      res.status(200).send();
    }
  );
});

router.post("/", (req, res) => {
  let warehouse = new Warehouse({
    streetNumber: req.body.streetNumber,
    streetName: req.body.streetName,
    city: req.body.city,
    province: req.body.province,
    postalCode: req.body.postalCode,
    country: req.body.country,
    phone: req.body.phone
  });
  warehouse.save((err, result) => {
    if (err) throw err;
    res.status(201).send();
  });
});

router.delete("/:id", (req, res) => {
  Warehouse.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) throw err;
    res.status(204).send();
  });
});

/***** EXPORTING ROUTER *****/
module.exports = router;
