import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    title: {
     type: String,
      required: true,
       trim: true 
      },
  slug: { 
    type: String,
     required: true,
      lowercase: true,
       trim: true 
      },

  rpm_group_id: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "RPMGroup",
      //  type: String, 
      // enum: ["High", "Medium", "Low"], // only these names allowed
      required: true 
    }
});

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    unique: true, 
    required: true, 
    trim: true 
  },
  topics: [topicSchema]
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;


// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     unique: true,
//     required: true,
//      trim: true,
//   },

//   topics: [
//     {
//       slug: {
//         type: String,
//         required: true,
//         lowercase: true,
//         trim : true
        
//       },
//       title :{
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//       },
//         rpm_group_id:{
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "RPMGroup",
//          required: true 
//       }
//     }

//   ],


//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// }, { timestamps: true });

// const Categorie = mongoose.model("Categories", categorySchema)
// export default Categorie;
// // export const Categorie = mongoose.model('categories', categorySchema);


