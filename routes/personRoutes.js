const express = require('express')
const router = express.Router();

const Person = require('./../models/Person')
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newPerson = new Person(data);
        // newPerson.name=data.name;
        // newPerson.age=data.age;
        // newPerson.email=data.email;
        // newPerson: data.date;

        const response = await newPerson.save()

        console.log('Data Saved Suscessfully');
        const payload = {
            id: response.id,
            username: response.username
        }
        console.log(JSON.stringify(payload));

        const token = generateToken(payload);

        console.log("Token is : ", token);

        
        res.status(200).json({response : response, token:token});

    }

    catch (error) {
        console.log("error in Saving Person: ", error);
        res.status(500).json({ error: 'Internal Server Error' })
    }


})



router.post('/login', async(req, res) => {
    try{
        // Extract username and password from request body
        const {username, password} = req.body;

        // Find the user by username
        const user = await Person.findOne({username: username});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        console.log("User Data: ", userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})




router.get('/', jwtAuthMiddleware,async (req, res) => {

    try {
        const data = await Person.find()
        console.log("Data Fetched");
        res.status(200).json(data);
    }
    catch (error) {
        console.log("error in Saving Person: ", error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})




router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;  // Extract the work type from the URL parameter
        //http://localhost:2000/person/Chef
        if (workType == 'Chef' || workType == 'Manager' || workType == 'Waiter' || workType == 'Sequrity') {
            const response = await Person.find({ work: workType });
            console.log('response fetched');
            res.status(200).json(response);
        }
        else {
            res.status(404).json({ error: 'Invalid Woek type' })
        }
    }
    catch (error) {
        console.log("error in Saving Person: ", error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.put('/:id', async (req, res)=> {
    try {
    const personId = req.params.id;
    // Extract the person's ID from the URL parameter
    const updatedPersonData = req.body;
    // Updated data for the person
    // Assuming you have a Person model
    const updatedPerson = await Person.findByIdAndUpdate(personId, updatedPersonData, {
    
    new: true, // Return the updated document
    runValidators: true,    // Run Mongoose validation
    })
    if(!updatedPerson) {
     return res.status(404).json({ error: 'Person not found'})
    }
    console.log( 'data updated');
    res.status (200).json( updatedPerson) ;
}
catch (error) {
    console.log("error in Saving Person: ", error);
    res.status(500).json({ error: 'Internal Server Error' })
}
})

router.delete('/:id', async (req, res)=> {
    try {
    const personId = req.params.id;   // Extract the person's ID from the URL parameter
    
    const response = await Person.findByIdAndDelete(personId)
    if(!response) {
     return res.status(404).json({ error: 'Person not found'})
    }
    console.log( 'data Deleted');
    res.status(200).json({message: "Deleted Sucessfully"}) ;
}
catch (error) {
    console.log("error in Saving Person: ", error);
    res.status(500).json({ error: 'Internal Server Error' })
}
})




module.exports = router;