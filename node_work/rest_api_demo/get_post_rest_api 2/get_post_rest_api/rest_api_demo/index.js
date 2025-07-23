const express=require('express');
const app=express();
const PORT=3000;


// in-memory data
let users=[
    {id: 1,name: 'John Doe'},
    {id: 2,name: 'Jane Smith'},
    {id: 3,name: 'Alice Johnson'}
];

// middleware to parse JSON bodies
app.use(express.json());
//path for index.html
path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));});


app.use(express.static(path.join(__dirname,'public')));
// GET endpoint to retrieve all users
app.get('/users', (req, res) => {
    res.json(users);
});
// POST endpoint to add a new user
app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length + 1; // simple ID assignment
    users.push(newUser);
    res.status(201).json(newUser);
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});