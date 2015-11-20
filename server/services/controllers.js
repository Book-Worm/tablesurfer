var database = require('./db');
var Promise = require('bluebird'); // use sequalize's bluebird instead
var objectify = require('./../classes/controllerClasses');

module.exports = {
  user: {

    get: function () {
      return database.Users.findAll()
      .then(function (users) {
        return users;
      });
    },

    post: function (data) {
      return database.Users.create({
        username: data.displayName,
        facebookId: data.facebookId
      }).then(function (message) {
        return message;
      });
    },

    //for a user joining a meal
    joinMeal: function(data) { // use put 
      return database.Users.find({ where: {firstName: data.firstName, lastName: data.lastName} })
      .then(function(user) {
        //this should get the user data that matched the user details passed
        return database.Meals.find({ where: {description: data.description} })
        .then(function(meal) {
          //meal should be an object containing the table input for this meal
          return database.Attendees.create({
            UserId: user.id,
            MealId: meal.id
          })
          .then(function(attendee) {
            return attendee;
          });
        });
      });
    }

    // delete method

  },

  meals: {

    // TODO: Perhaps rename to getAll?
    get: function (data) { // what to expect from get meal
      return database.Meals.findAll({ include: [database.Users, database.Restaurants]})
        .then(function (meals) {
          //use the bluebird promise functions
          return Promise.map(meals, function(meal) {
            return meal.getUsers().then(function(result) {
              var mealObj = {meal: meal, attendees: result};
              return mealObj;
            });
          });
        }).then(function(meals) {
          //make an object to send back
          var obj = [];
          meals.map(function(meal, i) {
            obj.push(new objectify.restaurantData(meal));
          });
          // console.log('----------',meals);
          return obj;
        });
    },

    getOne: function (data) {

      return database.Meals.find({ where: {id: data}, include: [database.Users, database.Restaurants] })
        .then(function (meal) {
          return meal.getUsers().then(function (result) {
            var mealObj = {meal: meal, Attendees: result};
            console.log(mealObj);
            return mealObj;
          });

        });
    },

    post: function (data) {
      return database.Users.findOrCreate({where: {username: data.username}})
        .then(function (user) {
          return database.Restaurants.findOrCreate({where: {name: data.restaurant}, defaults:  {name: data.restaurant, address: data.address, contact: data.contact, lat: data.latitude, lng: data.longitude}})
            .then(function (restaurant) {
              return database.Meals.create({
                title: data.title,
                date: data.date,
                time: data.time,
                description: data.description,
                UserId: user[0].dataValues.id,
                RestaurantId: restaurant[0].dataValues.id
              }).then(function (message) {
                return message;
              });
            });
        });
    }
  },
  restaurants: {},
  genre: {}
};
