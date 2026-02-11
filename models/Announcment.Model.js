import mongoose, { Schema } from "mongoose";

const updateSchema = new mongoose.Schema({

 title: { 
    type: String,
     required: true 
    },
  description: { 
    type: String, 
    required: true 
},
  category: { 
    type: String, 
    default: "announcement",
    enum : ["announcement", "feature" , "maintenance"]
}, // feature, maintenance, announcement
}, {timestamps : true})
const update = mongoose.model("update", updateSchema)

export default update