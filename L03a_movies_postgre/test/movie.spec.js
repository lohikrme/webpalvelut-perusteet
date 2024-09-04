const mocha = require('mocha')
const chai = require('chai');
const chaihttp = require('chai-http');
const app = require('../index');
const query = require('../db/movies');
const should = chai.should();
const { expect } = require('chai');

chai.use(chaihttp);

const testMovie = {
  title: 'The Godfather',
  director: 'Francis Ford Coppola',
  year: 1972
}

// created a testUser straight into database
const testEmail =  'joe.biden@gmail.com';
const testPassword = 'john007';
let testToken = 'replaceWithToken';

mocha.describe("ADD A NEW MOVIE at 'POST /api/movies'", () => {
  beforeEach((done) => {
    query.deleteAllMovies();
    done();
  });
  it('Requires a log in', (done) => {
    chai.request(app)
      .post('/api/movies')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(testMovie))
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
  it('should add a new movie after login', (done) => {
  chai.request(app)
    .post('/api/movies')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${testToken}`)
    .send(JSON.stringify(testMovie))
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.should.have.property('title') == 'The Godfather';
      done();
    });
  });
}); // ADD MOVIE ENDS


mocha.describe("FETCH ALL MOVIES at 'GET /api/movies'", () => {
  it('Requires a log in', (done) => {
    chai.request(app)
      .post('/api/movies')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(testMovie))
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
    it('Fetch all movies', (done) => {
      chai.request(app)
        .get('/api/movies') 
        .set('Authorization', `Bearer ${testToken}`)
        .end((err, res) => {
           res.should.have.status(200);
           res.body.should.be.a('array');
           res.body.length.should.be.eql(1);
           done();
        });
    });
  });

