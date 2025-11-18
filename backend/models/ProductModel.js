import mongoose from "mongoose";
import user from "./userModel.js";
const {objectId} = mongoose.Schema;

const reviewSchema = mongoose.Schema({
    name:{type:String, required:true},
    rating:{type:Number, required:true},
    comment:{type:String, required:true},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
},{
    timestamps:true,
});

const productSchema = mongoose.Schema({
    title:{type:String, required:true,},
    author:{type:String, required:true, },
    category:{type:mongoose.Schema.Types.ObjectId, required:true,ref:'Category'  },
    genre:{type:String, required:true, },
    summary:{type:String, required:true, },
    publishedDate:{type:Date, required:true, },
    language:{type:String, required:true, },
    price:{type:Number, required:true, },
    countInStock:{type:Number, default:0 },
    reviews:[reviewSchema],
    coverImage:{type:String, required:true, },
    ratings:{type:Number, default:0 },
    numReviews:{type:Number, default:0 },
},{
    timestamps:true,
},);

const Product = mongoose.model('Product', productSchema);
export default Product;