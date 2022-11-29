const mongoose = require('mongoose');

const commntSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },

    comment:{
        type:String,
        required:true,
    },

    date:{
        type:Date,
        default:Date.now
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
    }
})

const comment = mongoose.model('Comment',commntSchema)
module.exports = comment;