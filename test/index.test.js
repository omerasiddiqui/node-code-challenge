const request = require('supertest')
const app = require('../index')
var assert = require('chai').assert;
var should = require('chai').should();

var data = require('../dataResult.json');


describe('Stranger Things Code Challenge', function () {

    it("successfully sends the json response", function (done) {
        request(app).get('/')
            .expect(200, done)
    })

    it('has the correct duration', function () {
        assert.equal(data[2993].totalDurationSec, 91740);
    });

    it('has correct episodes per season', function () {
        assert.equal(data[2993].averageEpisodesPerSeason, 8.7);
    });

    it('has proper JSON structure', function () {
        should.exist(data[2993]);
        should.exist(data[2993].totalDurationSec);
        should.exist(data[2993].averageEpisodesPerSeason);
        should.exist(data[2993].episodes);
    })

});