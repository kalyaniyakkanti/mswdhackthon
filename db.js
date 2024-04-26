const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://admin:admin@cluster0.h2jajev.mongodb.net/sheyrooms'

mongoose.connect(mongoURL,{useUnifiedTopology : true, useNewUrlParser : true})

var connection = mongoose.connection

connection.on('error',()=>{
    console.log('Mongo DB connection failed')
})
connection.on('connected',()=>{
    console.log('Mongo DB connection success')
})

module.exports=mongoose