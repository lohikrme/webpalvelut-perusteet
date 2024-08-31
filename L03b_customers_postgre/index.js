// index.js
// 14th august 2024

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const query = require("./db/customers");

const port = 3000;

// GET ALL CUSTOMERS
app.get("/api/customers", query.getAllCustomers);

// GET A CUSTOMER BY ID
app.get("/api/customers/:id", query.getCustomerById);

// ADD NEW CUSTOMER
app.post("/api/customers", query.addNewCustomer);

// DELETE EXISTING CUSTOMER BY ID
app.post("/api/customers/:id", query.deleteCustomer);

// UPDATE CUSTOMER BY ID
app.put("/api/customers/:id", query.updateCustomer);

app.listen(port, () => {
    console.log(`Customers-software is listening on port ${port}...`)
})

module.exports = app;