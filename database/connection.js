const mongoose = require('mongoose');

const URL = "mongodb+srv://HimanshuTripathi:tr1234@cluster0.vkwvvnc.mongodb.net/?retryWrites=true&w=majority";

const DBS = mongoose.connection;
mongoose.connect(URL,({useNewUrlParser:true}))

DBS.once('open',_ =>{
    console.log('Database connected');
})

DBS.on('error',err=>{
    console.log('error while connecting to database',err)
})
