import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const roleSchema=new mongoose.Schema({
    _id: {
        type: String,  // Change the type to String for UUID
        default: uuidv4,  // Set the default value to a generated UUID
      },
      name:{
        type:String,
        required:true,
        unique:true,
      },
      permissions:[String]
});
const Role=mongoose.model('Role',roleSchema);
export default Role;