/***** MODULE IMPORTS *****/
const mongoose = require("mongoose");
const Warehouse = require("./warehouseModel")
const Schema = mongoose.Schema;

/***** SCHEMA DEFINITION *****/
let itemSchema = Schema({
	name: {
		type: String, 
		required: true
	},
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    price:{
        type: mongoose.Types.Decimal128, 
        required: true,
        min: 0.01
    },
    tags: [String],
    warehouseLocations: [{ 
        type: Schema.Types.ObjectId, ref: 'Warehouse'
    }]
});

/***** EXPORT *****/
const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
