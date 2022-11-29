const mongoose = require('mongoose');
const postBlog = new mongoose.Schema({

    username:{
        type:String,
        required:true,
    },

    title:{
        type:String,
        required:true,
    },

    desc:{
        type:String,
        required:true,
    },

    comments:[{
        type:mongoose.Schema.Types.ObjectID,
        ref:"comment",
    }]

})

const post = mongoose.model('Post',postBlog);
module.exports = post