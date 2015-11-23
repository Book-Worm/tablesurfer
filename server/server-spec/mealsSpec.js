var Promise = require('bluebird');
var request = require('request-promise');
var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;
var Sequelize = require('Sequelize');
var db = require('../config/db');




describe("Meals insertion to database", function() {

  var obj = {};
  //dates and times to be formatted using moment.js checker thing
  obj.name = "Super Duper";
  obj.address = ["Hot Cakes Lane USA"];
  obj.contact = "555-555-5555";
  obj.lat = -76.0;
  obj.lng = 76.0;
  obj.cuisine = "Ethiopian";
  obj.username = "Colin";
  obj.title = "Beet Salad";
  obj.date = "12/11/3015";
  obj.time = "10:10pm";
  obj.description = "Ethiopian beet salad is a tangy and delicious combination of marinated beets, spice, and sometimes potatoes and carrots.";
  
  var user = {
      name: "Colin",
      facebookId: 5243653562365
  };

  before(function (done){
    sequelize = new Sequelize("tablesufer", "admin", "admin", {dialect: "postgres"})
    sequelize.sync({force:true})
    .then(function(data){
      return request({method: "POST", uri: "http://127.0.0.1:3000/api/user", body: user, json: true})
    }).then(function(data){
      done();
    }).catch(function(err){
      done(err);
    });

  });

  it("Should have return an error (400) status for sending wrong data", function (done) { 
  
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: {title: ""}, json: true})
    .catch(function(err){
      expect(err.statusCode).to.equal(400);
      done();
    });
    
  });

  it("Should have return an 201 when data gets successfully added to database", function (done) { 
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true, resolveWithFullResponse: true})
    .then(function (res) {
      expect(res.statusCode).to.equal(201);
      done();
    }).catch(function(err){
      done(err);
    });
    
  });


  it("Should persist data to database", function (done) { 

    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true, resolveWithFullResponse: true})
    .then(function (data) {
      return db.Restaurant.find( {where : {cuisine : "Ethiopian"} })
    }).then( function (meal) {
      expect(meal.cuisine).to.equal("Ethiopian");
      done();
    }).catch(function(err){
      done(err);
    });
    
  });


  it("Should select data by id", function (done) { 

    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true})
    .then(function (data) {
      return request({method: "GET", uri: "http://127.0.0.1:3000/api/meal/1", json: true})
    }).then(function(data){
      expect(data.title).to.equal('Beet Salad');
      done();
    }).catch(function(err){
      done(err);
    });
    
  });

  it("Should get all the meals in the database", function (done) { 

    var allPosts = [];
    for (var i = 0; i < 10; i ++) {
      allPosts.push(request({method:"POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true}));
    }

    Promise.all(allPosts)
    .then(function(){
      return db.Meal.findAll()
    })
      .then(function(data){
        expect(data.length).to.equal(13);
        done();
      })
    .catch(function(err){
      done(err);
    });
    
  });

  it("Should add a user to a meal", function (done) { 

    var putObj = { name : "Colin" , facebookId : 5243653562365, description : obj.description }

    request({method:"PUT", uri: "http://127.0.0.1:3000/api/meal", body: putObj, json: true, resolveWithFullResponse: true})
    .then(function (data) {
      return db.Meal.find( { where : { description : obj.description } } )
    })
    .then(function(meal){
      return meal.getAttendee()
    })
    .then(function(attendees){
      expect(attendees[0].dataValues.name).to.equal('Colin');
      done();
    })
    .catch(function(err){
      done(err);
    })

  });

});


