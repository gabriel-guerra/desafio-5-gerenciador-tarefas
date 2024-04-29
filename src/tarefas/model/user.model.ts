import { Schema, model } from "mongoose";

const schemaData = {
    username: String,
    password: String,
    email: String,
    weight: Number
}

const userModel = new Schema(schemaData, {
    timestamps: true
});

export default model('User', userModel);
export { schemaData };

