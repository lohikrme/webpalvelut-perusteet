const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// bodyparser.urlencoded needed for example space = %20 in request body
// extended true uses more complex library, false would accept only simple key-value pairs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

const port = 3000;

// template view engine such as pug allows easy front end implementation
app.set('view engine', 'pug');

let newewst_id = 1125;
let customers = [
    {id: '1123', firstname: 'John', lastname: 'Johnson', email: 'john@johnson.com', phone: '8233243'},
    {id: '1124', firstname: 'Mary', lastname: 'Smith', email: 'mary@smith.com', phone: '6654113'},
    {id: '1125', firstname: 'Peter', lastname: 'North', email: 'peter@north.com', phone: '901176'},
];

// tests that the service is working during development
app.get("/hello", (req, res) => {
    res.render("hello", {firstname: 'John', lastname: 'Johnson'});
});

// shows all customers
app.get("/", (req, res) => {
    console.log(customers);
    // {var1, var2} structure means var1 is the local var for pug file, var2 is the data from index.js
    res.render("customers", {customers: customers});
});

// the front end for client to add a customer
app.get("/addcustomer", (req, res) => {
    res.render("addcustomer");
});

// the backend process of adding a customer
app.post("/addcustomer", (req, res) => {
    newewst_id += 1;
    const { firstname, lastname, email, phone } = req.body;
    customers.push({ id: newewst_id.toString(), firstname: firstname, lastname: lastname, email: email, phone: phone });
    res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});