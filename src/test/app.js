const request = require('supertest');
const app = require('../index.js');

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/')
      .expect(302, done);
  });
});

describe('GET /login', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /register', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/register')
      .expect(200, done);
  });
});

describe('GET /forgot', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/forgot')
      .expect(200, done);
  });
});

describe('GET /random-url', () => {
  it('should redirect to /login', (done) => {
    request(app)
      .get('/random-url')
      .expect(302, done);
  });
});
