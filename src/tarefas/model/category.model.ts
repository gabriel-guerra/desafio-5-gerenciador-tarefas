import { Schema, model } from "mongoose";

const schemaData = {
    name: String,
    color: String
}

const categoryModel = new Schema(schemaData, {
    timestamps: true
});

export default model('Category', categoryModel);
export {schemaData};

