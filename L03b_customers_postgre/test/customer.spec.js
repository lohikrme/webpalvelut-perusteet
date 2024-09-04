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
const testCustomer = {
    firstname: "Mary",
    lastname: "Smith",
    email: "mary@smith.com",
    phone: 6654113
};

// created a testUser straight into database
const testEmail =  'joe.biden@gmail.com';
const testPassword = 'john007';
let testToken = 'replaceWithToken';


mocha.describe("ADD A NEW CUSTOMER at 'POST /api/customers'", () => {
    beforeEach((done) => {
        query.deleteAllCustomers();
        done();
    })
    it('requires a log in', (done) => {
        chai.request(app)
          .post('/api/customers')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(testCustomer))
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
    });
    it('expects to log in successfully', (done) => {
    chai.request(app)
        .post('/login')
        .send({ email: testEmail, password: testPassword })
        .end((err, res) => {
            expect(res).to.have.status(200);
            testToken = res.body.token;
            console.log(`\n \n THE TEST TOKEN LOOKS NEXT \n \n ${testToken} \n \n \n`)
            done();
        });
    });
    it("add a new customer at POST endpoint '/api/customers'", (done) => {
        chai.request(app)
            .post("/api/customers")
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${testToken}`)
            .send(JSON.stringify(testCustomer))
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.all.keys(['firstname', 'lastname', 'phone', 'email']);
                done();
            });
    });
});



mocha.describe("FETCH ALL CUSTOMERS at 'GET /api/customers'", () => {
    it('requires a log in', (done) => {
        chai.request(app)
          .get('/api/customers')
          .set('Content-Type', 'application/json')
          .send(JSON.stringify(testCustomer))
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
    });
    it('expects to log in successfully', (done) => {
    chai.request(app)
        .post('/login')
        .send({ email: testEmail, password: testPassword })
        .end((err, res) => {
            expect(res).to.have.status(200);
            testToken = res.body.token;
            console.log(`\n \n THE TEST TOKEN LOOKS NEXT \n \n ${testToken} \n \n \n`)
            done();
        });
    });
    it("fetch all customers", (done) => {
        chai.request(app)
            .get("/api/customers")
            .set('Authorization', `Bearer ${testToken}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array')
                let firstcustomer = res.body[0];
                expect(firstcustomer).to.have.all.keys(['id', 'firstname', 'lastname', 'email', 'phone']);
                done();
            });
    });
});




