/***** MODULE AND MODEL IMPORTS *****/
const express = require("express");
const countryList = require("country-list");
const validator = require("validator");
const Warehouse = require("../models/warehouseModel");

/***** ROUTER SETUP *****/
const router = express.Router();

/***** HELPER FUNCTIONS *****/
let verifyFields = (body) => {
  errMessage = [];
  if (!body.streetNumber) {
    errMessage.push("Street number is required");
  }
  if (!body.streetName) {
    errMessage.push("Street name is required");
  }
  if (!body.city) {
    errMessage.push("City is required");
  }
  if (!body.province) {
    errMessage.push("Province/State is required");
  }
  if (!countryList.getCode(body.country)) {
    errMessage.push("Invalid country and country is required");
  } else {
    if (!body.postalCode) {
      errMessage.push("Postal/ZIP Code is required");
    } else if (!validator.isPostalCode(body.postalCode, countryList.getCode(body.country))) {
      errMessage.push("Unsupported Postal Code/Country pairing");
    }
  }
  if (!body.phone) {
    errMessage.push("Phone number is required");
  } else {
    if (!validator.isMobilePhone(body.phone, "any")) {
      errMessage.push("Invalid/Unsupported phone number");
    }
  }
  return errMessage.join(", ");
};

let countryAlias = (country)=>{
  let countryAliases = {"United States":"United States of America"};
  let ret = countryAliases[country];
  if(!ret){
    ret = country;
  }
  return ret;
}

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

router.get("/new", (req, res)=>{
  return res.render("warehouse");
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
  req.body.country = countryAlias(req.body.country);
  let errorMessage = verifyFields(req.body);
  if (!errorMessage) {
    let country = countryList.getCode(req.body.country);
    Warehouse.updateOne(
      { _id: req.params.id },
      {
        streetNumber: req.body.streetNumber,
        streetName: req.body.streetName,
        city: req.body.city,
        province: req.body.province,
        postalCode: req.body.postalCode,
        country: country,
        phone: req.body.phone,
      },
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .send({message:"An error occurred. There is a possibility of invalid data."});
        }
        return res.status(200).send();
      }
    );
  } else {
    return res.status(400).send({message: errorMessage});
  }
});

router.post("/", (req, res) => {
  req.body.country = countryAlias(req.body.country);
  let errorMessage = verifyFields(req.body);
  if (!errorMessage) {
    let country = countryList.getCode(req.body.country);

    let warehouse = new Warehouse({
      streetNumber: req.body.streetNumber,
      streetName: req.body.streetName,
      city: req.body.city,
      province: req.body.province,
      postalCode: req.body.postalCode,
      country: country,
      phone: req.body.phone,
    });
    warehouse.save((err, result) => {
      if (err) {
        return res
          .status(500)
          .send({message: "An error occurred. There is a possibility of invalid data."});
      }
      return res.status(201).send(warehouse);
    });
  }
  else{
    return res.status(400).send({message: errorMessage});
  }
});

router.delete("/:id", (req, res) => {
  Warehouse.deleteOne({ _id: req.params.id }, (err, result) => {
    if (err) throw err;
    res.status(204).send();
  });
});

/***** EXPORTING ROUTER *****/
module.exports = router;
