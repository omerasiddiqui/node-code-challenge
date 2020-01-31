const request = require('supertest')
const app = require('../index')
var assert = require('chai').assert;

describe('index', function () {
    it("sends a json object", function (done) {
        request(app).get('/')
            .expect(200, done)
    })
})