// router.js
// 20th may 2024

// init express application
const express = require('express');
const app = express();
app.use(express.json()); //middleware that reads json form data

// listening port 3000
const port = 3000;
app.listen(port, () => {
    console.log("Listening port 3000...");
});

// data of customers
var customers = [
    {id: '1588323375416', firstName: 'John', lastName: 'Johnson', email: 'john@johnson.com', phone: '8233243'},
    {id: '1588323375417', firstName: 'Mary', lastName: 'Smith', email: 'mary@smith.com', phone: '6654113'},
    {id: '1588323375418', firstName: 'Peter', lastName: 'North', email: 'peter@north.com', phone: '901176'},
]

// starting page endpoint
app.get("/", (req, res) => {
    res.send("Welcome to our website!")
});

// read all customers endpoint
app.get("/api/customers", (req, res) => {
    res.json(customers);
});

// read a customer by id endpoint
app.get("/api/customer/:id", (req, res) => {
    const customerId = req.params.id;
    const customer = customers.filter(localCustomer => customerId == localCustomer.id);
    if (customer.length > 0) res.json(customer); 
    else res.status(404).send(`customer id is: ${req.params.id}`);
});

// add a new customer autogenerate id endpoint
app.post("/api/customers", (req, res) => {
    const newCustomer = {"id": Date.now().toString(), ...req.body};
    customers = [...customers, newCustomer];
    res.json(newCustomer);
});

// delete an existing customer by id endpoint
app.delete("/api/customers/:id", (req, res) => {
    const reqID = req.params.id;
    const deletedCustomer = customers.filter(customer => customer.id == reqID);
    customers = customers.filter(customer => customer.id != reqID);
    res.json(deletedCustomer);
});

// modify an existing customer by id endpoint
// notice that updatedCustomer is an object
app.put("/api/customers/:id", (req, res) => {
    const id = req.params.id;
    const updatedCustomer = {id, ...req.body};
    //Get the index of updated movie
    const index = customers.findIndex(customer => customer.id == id);
    //Replace updated movie in the array
    customers.splice(index, 1, updatedCustomer);
    res.json(updatedCustomer);
});
