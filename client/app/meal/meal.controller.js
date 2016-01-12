// This controller should handle the unique view of a meal page
// Example: http://localhost.com/#/meal/4 (should show the 4th meal)

(function () {
  'use strict';

  angular.module('app')
  .controller('MealCtrl', MealCtrl);

  MealCtrl.$inject = ['$http', '$location', '$window'];

  function MealCtrl($http, $location, $window, Map) {
    var self = this;
    self.id = $location.path();
    self.data;
    var map;

    self.activate = function() {
      self.getMeal();
    };

    self.getMeal = function() {
      var path = '/api';
      console.log('Getting users from DB, path is: ', path + $location.path());
      return $http({
        method: 'GET',
        url: path + $location.path()
      })
      .then(function(response) {
        self.data = response.data;
        // Format the Dates and time
        self.data.meal.createdAt = new Date(self.data.meal.createdAt).toLocaleDateString();
        self.data.meal.date = new Date(self.data.meal.date).toLocaleDateString();
        self.data.meal.time = new Date(self.data.meal.time).toLocaleTimeString();

        var mapCanvas = document.getElementById('map');
        var myLatLng = {lat: self.data.restaurant.lat, lng: self.data.restaurant.lng};
        var mapOptions = {
          center: new google.maps.LatLng(self.data.restaurant.lat, self.data.restaurant.lng),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(mapCanvas, mapOptions);

        var marker = new google.maps.Marker({
          position: myLatLng,
          title: self.data.meal.title
        });

        marker.setMap(map);


      });
    };

    self.activate();

  }

})();
