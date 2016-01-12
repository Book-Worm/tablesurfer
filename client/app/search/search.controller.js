(function() {
  'use strict';

  angular.module('app')
  .controller('SearchCtrl', SearchCtrl);

  SearchCtrl.$inject = ['$http', '$q', '$log', '$window', 'searchFactory'];

  function SearchCtrl($http, $q, $log, $window, searchFactory) {
    // TODO: Please verify that this matches the refactored style

    var self = this;
    // below are settings for the md-autocomplete directive
    self.simulateQuery = false;
    self.isDisabled = false;
    //below is a hack for testing, we are struggling to access facebook auth username from client side
    self.meal = {};
    self.meal.host = {};
    self.meal.meal = {};
    // self.meal = {
    //   meal: {
    //     title: "Men's Lunch",
    //     date: "12/7/15",
    //     time: "12:00pm",
    //     theme: "Hack Reactor Lunch for Men",
    //     attendeeLimit: 9,
    //     description: "Ethiopian beet salad is a tangy and delicious combination of marinated beets, spice, and sometimes potatoes and carrots."
    //   },
    //   restaurant: {
    //     name: "Kin Khao",
    //     address: "1234 Powell St.",
    //     contact: "415-420-8282",
    //     lat: 123.45,
    //     lng: 125.89,
    //     cuisine: "Thai",
    //     image_url: "http://image.com/image.jpg",
    //     url: "http://yelp.com/kinkhao"
    //   }
    // };

    self.attendees = [1,2,3,4,5,6,7,8,9];
    self.selectedItem = undefined;

    self.querySearch = function(query) {
      var path = '/api/yelp';

      return $http({
        url: path + '?term=' + query,
        method: 'GET',
      }).
        then(function(response) {
          self.status = response.status;
          self.iteratee = response.data;
          self.data = [];
          _.each(self.iteratee, function(item) {
            if (!item.is_closed && item.rating && item.name && item.url && item.categories && item.phone && item.location) {
              self.data.push({
                'rating': item.rating,
                'name': item.name,
                'url': item.url,
                'categories': item.categories,
                'phone': item.phone,
                'display_address': item.location.display_address,
                'coordinate': {
                  lat: item.location.coordinate.latitude,
                  lng: item.location.coordinate.longitude
                },
                image_url: item.image_url
              });
            }
          });
        }, function(response) {
          self.data = response.data || "Request failed";
          self.status = response.status;
          console.log('Error during querySearch.');
        })
        .then(function(response) {
          return self.data;
        });

    };

    self.add = function () {
      self.meal.restaurant.cuisine = self.meal.restaurant.categories[0][0];
      self.meal.restaurant.lat = self.meal.restaurant.coordinate.lat;
      self.meal.restaurant.lng = self.meal.restaurant.coordinate.lng;
      self.meal.restaurant.address = self.meal.restaurant.display_address;
      self.meal.restaurant.contact = self.meal.restaurant.phone;
      self.meal.restaurant.image_url = self.meal.restaurant.image_url;

      return searchFactory.postMeal(self.meal)
      .then(function(response) {
        $window.location = '/#/home';
      });

    };

    self.showToken = function () {
      // console.log(self.meal);
      searchFactory.postMeal(self.meal)
      .then(function(response) {
        $window.location = '/#/home';
      });

    };

    self.init = function () {
      var fbId = sessionStorage.getItem('facebookId');
      if (!fbId) {
        $window.location = '/#/home';
      }
      else {
        self.meal.host.facebookId = fbId;
      }

    };

    self.init();
}
})();
