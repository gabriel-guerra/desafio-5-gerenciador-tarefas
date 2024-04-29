import { userType } from "./user.type";

export interface taskType {
    title: String,
    description: String,
    creationDate: Date,
    conclusionDate: Date,
    category: String,
    status: String, 
    associatedUser: userType
}