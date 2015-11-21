var Promise = require('bluebird');
var request = require('request-promise');
var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;
var Sequelize = require('Sequelize');
var db = require('../config/db');




describe("Meals insertion to database successful", function() {

  var obj = {};
  obj.restaurant = {};
  //dates and times to be formatted using moment.js checker thing
  obj.title = 'Hello :>';
  obj.date = "1/1/2015";
  obj.time = "2:00pm";
  obj.description = "Testing 123...";
  obj.restaurant.name = "Super Duper";
  obj.restaurant.address = "Hot Cakes Lane USA"
  obj.restaurant.contact = "555-555-5555"
  obj.restaurant.coordinate = {};
  obj.restaurant.coordinate.lat = "0"
  obj.restaurant.coordinate.lng = "0"
  obj.username = "Colin"


  beforeEach(function (done){
    sequelize = new Sequelize("tablesufer", "admin", "admin", {dialect: "postgres"})
    sequelize.sync({force:true})
    .then(function(data){
      done();
    }).catch(function(err){
      console.log(err);
    })

  })

  it("Should have return an error (400) status for sending wrong data", function (done) { 
 
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/in/meals", body: {title: ""}, json: true})
    .then(function (data) {

    }).catch(function(err){
      expect(err.statusCode).to.equal(400);
      done();
    });
    
  });

  it("Should have return an 201 when data gets successfully added to database", function (done) { 

    return request({method: "POST", uri: "http://127.0.0.1:3000/api/in/meals", body: obj, json: true})
    .then(function (data) {
      expect(err.statusCode).to.equal(201);
      done();
    }).catch(function(err){

    });
    
  });


  it("Should persist data to database", function (done) { 

    return request({method: "POST", uri: "http://127.0.0.1:3000/api/in/meals", body: obj, json: true})
    .then(function (data) {
      expect(err.statusCode).to.equal(400);
      done();
    }).catch(function(err){
      console.log(err);
    });
    
  });


  it("Should select data by id", function (done) { 

    return request({method: "POST", uri: "http://127.0.0.1:3000/api/in/meals", body: obj, json: true})
    .then(function (data) {
      return request({method: "GET", uri: "http://127.0.0.1:3000/api/in/meals/1", json: true})
    }).then(function(data){
      expect(data[0].title).to.equal('Hello :>');
      done();
    }).catch(function(err){
      console.log(err);
    });
    
  });

    it("Should get all the meals in the database", function (done) { 

    var allPosts = [];
    for (var i = 0; i < 10; i ++) {
      allPosts.push(request({method:"POST", uri: "http://127.0.0.1:3000/api/in/meals", body: obj, json: true}));
    }

    Promise.all(allPosts)
    .then(function(){
      db.Meal.findAll()
      .then(function(data){
        expect(data.length).to.be(10);
        done();
      })
    })
    .catch(function(err){
      console.log(err);
    });
    
  });


});


