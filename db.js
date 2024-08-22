const mongoose = require('mongoose')

// Define MongoDB connection URL
 const mongoURL=  'mongodb://127.0.0.1:27017/person'

 //Set-up MOngoDB Connection



 const db = async ()=>{
  try {
    const connectionInstance= await mongoose.connect(mongoURL)
    console.log(`\nMongodB Connection: ${connectionInstance.connection.host}`);

  } catch (error) {
    console.error("Connection Error to MongodB", error)
    throw error
  }
}
 
 //  mongoose.connect(mongoURL,{
   
//   useNewUrlParser: true, useUnifiedTopology: true

//  })

//  //Mongoose maintain  a default connection object representing the Mongodb Connection 
//  const db=mongoose.connection

// db.on('connected', ()=>{
// console. log("Connected to MOngodB Server")
// })


// db.on('error', ()=>{
//   console. log("Connection Error to MongodB")
// })


//   db.on('disconnected', ( )=>{
//     console. log("MOngodB Server Disconnected")
//   })







  module.exports=db;


  //  const db = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(mongoURL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connection: ${connectionInstance.connection.host}`);

//     // Handle other connection states with events
//     const db = mongoose.connection;

//     db.on('disconnected', () => {
//       console.log('MongoDB Server Disconnected');
//     });

//     return connectionInstance;
//   } catch (error) {
//     console.error('Connection Error to MongoDB', error);
//     throw error;
//   }
// };

 