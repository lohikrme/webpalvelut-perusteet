const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const app = require ('../index.js');
const query = require('../db/customers.js');
const should = chai.should();
const { expect } = require('chai');

chai.use(chaiHttp);

// notice that this "json" data is technically a javascript object data
// so, it looks different than data inside example-customers.json file
// thats why u must JSON.stringify it to send it to the addNewCustomer() method
const example_customer = {
      firstname: "Mary",
      lastname: "Smith",
      email: "mary@smith.com",
      phone: 6654113
    };


mocha.describe("/api/customers (POST)", () => {
    beforeEach(() => {
        query.deleteAllCustomers();
    })
    it("add a new customer at POST endpoint '/api/customers'", (done) => {
        chai.request(app)
            .post("/api/customers")
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(example_customer))
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.all.keys(['firstname', 'lastname', 'phone', 'email']);
                done();
            })
    })
})


mocha.describe("fetch all customers at GET endpoint: '/api/customers'", () => {

    it("respond should have status 200", (done) => {
        chai.request(app)
            .get("/api/customers")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
    it("respond should return an array (of jsons)", (done) => {
        chai.request(app)
            .get("/api/customers")
            .end((err, res) => {
                res.body.should.be.a('array')
                done();
            })
    })
    it("respond should have id, firstname, lastname, email, phone", (done) => {
        chai.request(app)
            .get("/api/customers")
            .end((err, res) => {
                let firstcustomer = res.body[0];
                console.log(firstcustomer);
                expect(firstcustomer).to.have.all.keys(['id', 'firstname', 'lastname', 'email', 'phone']);
                // use to.have.property('firstname') if u want to check individual keys
                // all.keys means, u must check for every key of object, not pass a single key, or fail test
                done();
            })
    })
})



