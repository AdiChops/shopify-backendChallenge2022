/***** MODULE AND MODEL IMPORTS *****/
const express = require("express");
const countryList = require("country-list");
const validator = require("validator");
const Warehouse = require("../models/warehouseModel");

/***** ROUTER SETUP *****/
const router = express.Router();

/***** HELPER FUNCTIONS *****/

/**
 * Purpose: This function validate the request body before inserting to the database.
 * @param {*} body The JSON request body which contains the values submitted by the user
 * @returns an error message if there are errors that exist within the fields, blank otherwise.
 */
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

/**
 * Purpose: This function returns a country's name alias which may fail validation otherwise 
 * (e.g. United States fails validation, but United States of America works, but since United States is an acceptable value, it is replaced by United States of America).
 * More countries can be added as more aliases are needed.
 * @param {*} country The country for which we verify the alias.
 * @returns the country alias, the inputted country otherwise
 */
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
      return res
        .status(500)
        .send({message: "An error occurred."});
    }
    return res.render("warehouses", { warehouses: result });
  });
});

router.get("/new", (req, res)=>{
  return res.render("warehouse");
});

router.get("/:id", (req, res) => {
  Warehouse.findById(req.params.id, (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({message: "An error occurred."});
    }
    if(!result)
      return res.status(404).send("Warehouse not found");
    return res.render("warehouse", { warehouse: result });
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
          console.log(err);
          return res
            .status(500)
            .send({message: "An error occurred. There is a possibility of invalid data."});
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
        console.log(err);
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
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({message: "An error occurred."});
    }
    res.status(204).send();
  });
});

/***** EXPORTING ROUTER *****/
module.exports = router;
