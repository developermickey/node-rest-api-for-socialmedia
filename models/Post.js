const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            max: 500
        },
        img: {
            type: String,
        },
        likes:{
            type:Array,
            default:[]
        }
    },
        {timestamps: true}
);
 

module.exports = mongoose.model("Post", PostSchema);



