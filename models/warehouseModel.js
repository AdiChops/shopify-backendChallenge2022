/***** MODULE IMPORTS *****/
const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

/***** SCHEMA DEFINITION *****/
let warehouseSchema = Schema({
	streetNumber: {
		type: Number, 
		required: true
	},
    streetName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province:{
        type: String, 
        required: true
    },
    postalCode:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    }
});

/***** VALIDATION *****/
warehouseSchema.path("country").validate((val)=>{
    return validator.isISO31661Alpha2(val);
}, "Unsupported country code.");

warehouseSchema.path("postalCode").validate((val)=>{
    return validator.isPostalCode(val,"any");
}, "Invalid/Unsupported postal/ZIP code.");

warehouseSchema.path("phone").validate((val)=>{
    return validator.isMobilePhone(val,"any");
}, "Invalid phone number.");

/***** EXPORT *****/
const Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports = Warehouse;
