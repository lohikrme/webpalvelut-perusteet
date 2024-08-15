// customers.js
// 14th august 2024

const db = require('./dbconfig');

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM customers');
        res.json(result.rows);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server Error'});
    }
};

// Get customer by id
const getCustomerById = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
        // check customer exists
        if (result.rows.length > 0) {
            res.json(result.rows);
        }
        else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error'});  
    }
};

const addNewCustomer = async (req, res) => {
    try {
        const newCustomer = req.body;
        // check new customer has all required fields
        if (!newCustomer.firstname || !newCustomer.lastname || !newCustomer.email || !newCustomer.phone) {
            return res.status(400).json({ error: 'firstname, lastname, email and phone are required...' });
        }
        await db.query('INSERT INTO customers (firstname, lastname, email, phone) VALUES ($1, $2, $3, $4)', [newCustomer.firstname, newCustomer.lastname, newCustomer.email, newCustomer.phone]);
        res.json(newCustomer);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const removablePerson = await db.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
        if (removablePerson.rows.length < 1) {
            return res.status(404).json({ error: `Person of ID ${req.params.id} was not found from the database.`});
        } 
        await db.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
        return res.json(removablePerson.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const updateCustomer = async (req, res) => {
    try {
        // check person to update exists
        const updateablePerson = await db.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
        if (updateablePerson.rows.length < 1) {
            return res.status(404).json({ error: `Person of ID ${req.params.id} was not found from the database.`});
        } 

        // modify query based on which data they want to update
        const newInformation = req.body;

        if (newInformation.firstname || newInformation.lastname || newInformation.email || newInformation.phone) {
            let updateValues = [];
            let updateFields = [];
            let index = 1;

            if (newInformation.firstname) {
                updateFields.push(`firstname = $${index++}`);
                updateValues.push(newInformation.firstname);
            }
            if (newInformation.lastname) {
                updateFields.push(`lastname = $${index++}`);
                updateValues.push(newInformation.lastname);
            }
            if (newInformation.email) {
                updateFields.push(`email = $${index++}`);
                updateValues.push(newInformation.email);
            }
            if (newInformation.phone) {
                updateFields.push(`phone = $${index++}`);
                updateValues.push(newInformation.phone);
            }

            const updateSentence = `UPDATE customers SET ${updateFields.join(', ')} WHERE id = $${index}`;
            updateValues.push(req.params.id);

            await db.query(updateSentence, updateValues);

            // Palauta päivitetyt tiedot
            res.json(`new firstname: ${newInformation.firstname}, new lastname: ${newInformation.lastname}, new email: ${newInformation.email}, new phone: ${newInformation.phone}`);
        } else {
            res.status(422).json({ error: 'To update information, there must be 1 or more of next informations to update: firstname, lastname, email, phone'});
        }
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

module.exports = {
    getAllCustomers: getAllCustomers,
    getCustomerById: getCustomerById,
    addNewCustomer: addNewCustomer,
    deleteCustomer: deleteCustomer,
    updateCustomer: updateCustomer,
};