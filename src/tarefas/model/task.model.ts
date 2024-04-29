import { Schema, model } from "mongoose";

const schemaData = {
    title: { type: String, required: true },
    description: { type: String, required: true },
    creationDate: { type: Date, required: true },
    conclusionDate: { type: Date, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true }, 
    associatedUser: { type: String, required: true }
};

const taskModel = new Schema(
    schemaData, 
    {timestamps: true}
    );

export default model('Task', taskModel);
export {schemaData};
