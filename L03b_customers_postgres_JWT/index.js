// index.js
// 14th august 2024

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const query = require("./db/customers");
const auth = require('./services/authenticate')
const helmet = require('helmet');

const app = express();
app.use(bodyParser.json());
app.use(helmet());
const port = 3000;

// GET ALL CUSTOMERS
app.get("/api/customers", auth.authenticate, query.getAllCustomers);

// GET A CUSTOMER BY ID
app.get("/api/customers/:id", auth.authenticate, query.getCustomerById);

// ADD NEW CUSTOMER
app.post("/api/customers", auth.authenticate, query.addNewCustomer);

// DELETE EXISTING CUSTOMER BY ID
app.post("/api/customers/:id", auth.authenticate, query.deleteCustomer);

// UPDATE CUSTOMER BY ID
app.put("/api/customers/:id", auth.authenticate, query.updateCustomer);

// LOG IN
app.post("/login", auth.login);

app.listen(port, () => {
    console.log(`Customers-software is listening on port ${port}...`)
})

module.exports = app;