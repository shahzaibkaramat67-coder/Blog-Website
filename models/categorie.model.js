import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
     trim: true,
  },

  topics: [
    {
      slug: {
        type: String,
        required: true,
        lowercase: true,
        trim : true
        
      },
      title :{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      }
    }

  ],


  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Categorie = mongoose.model("Categories", categorySchema)
export default Categorie;
// export const Categorie = mongoose.model('categories', categorySchema);


