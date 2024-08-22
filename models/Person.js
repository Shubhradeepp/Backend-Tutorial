const mongoose = require('mongoose')

const bcrypt = require ('bcrypt');
//Data Modeling

const personSchema= new mongoose.Schema(
{
 name : {
    type : String,
    required: true
 },
 age:{
    type :Number
 },
 work :{
    type: String,
    enum: ['Chef','Waiter','Manager','Sequrity'],
    required: true
 },
 email :{
    type:String,
    required:true,
    unique:true,
    lowercase: true
 },
 username: {
 required: true,
 type: String
},

 password:{
 required: true,
 type: String
},

 date: { type: Date, default: Date.now },
});




personSchema.pre('save', async function(next){
   //When using arrow functions (e.g., async (next) => {}) as Mongoose middleware, you may encounter issues like TypeError: person.isModified is not a function because arrow functions do not bind their own this context. Instead, they inherit this from the surrounding lexical context.
   const person = this;

   // Hash the password only if it has been modified (or is new)
   if(!person.isModified('password')) return next();

   try{
       // hash password generation
       const salt = await bcrypt.genSalt(10);

       // hash password
       const hashedPassword = await bcrypt.hash(person.password, salt);
       
       // Override the plain password with the hashed one
       person.password = hashedPassword;
       next();
   }catch(err){
       return next(err);
   }
})

personSchema.methods.comparePassword = async function(enteredPassword){
   try{
       // Use bcrypt to compare the provided password with the hashed password
       const isMatch = await bcrypt.compare(enteredPassword, this.password); // this.password === Stored Hash password
       return isMatch;
   }catch(err){
       throw err;
   }
}
//The compare function automatically extracts the salt from storedHashqdPassword
//and uses it to hash the entered password. It then compares the resulting hash with the
//stored hash. If they match, it indicates that the entered password is correct.





const Person = mongoose.model('Person',personSchema );
module.exports=Person;
