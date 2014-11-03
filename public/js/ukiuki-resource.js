(function() {
  var resource;

  resource = angular.module('resourceMockup', []);

  resource.factory('ResourceGallery', function() {
    var api, categories, count, galleries, gallery, i, stats, _i;
    $("#spinner").removeClass('active');
    galleries = [];
    count = 20;
    for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
      gallery = {
        category: i < 6 ? "DIGITAL" : "CARTOONS",
        featured: true,
        key: "batman",
        title: "Batman",
        image: {
          url: "/images/gallery.gif"
        }
      };
      galleries.push(gallery);
    }
    categories = [
      {
        value: "DIGITAL",
        label: 'Digital'
      }, {
        value: "CARTOONS",
        label: 'Cartoons'
      }
    ];
    stats = [
      {
        _id: "DIGITAL",
        total: 5
      }, {
        _id: "CARTOONS",
        total: 15
      }
    ];
    api = {
      getFeatured: function(cb) {
        var result;
        result = {
          success: true,
          galleries: galleries,
          categories: categories
        };
        return cb(result);
      },
      getStatsByCategory: function(cb) {
        var result;
        result = {
          success: true,
          categories: stats
        };
        return cb(result);
      }
    };
    return api;
  });

  resource.factory('ResourceUser', function() {
    var api, users;
    users = [
      {
        "_id": "53dc4864d8b69354015c6171",
        "email": "mikeairweb@gmail.com",
        "featured": true,
        "isAdmin": true,
        "name": {
          "last": "User",
          "first": "Admin"
        },
        "username": "admin"
      }
    ];
    api = {
      getFeatured: function(cb) {
        var result;
        result = {
          success: true,
          users: users
        };
        return cb(result);
      },
      getCurrentUserData: function(cb) {
        var result;
        result = {
          status: 'OK',
          user: null
        };
        return cb(result);
      }
    };
    return api;
  });

}).call(this);

(function() {
  var resource;

  resource = angular.module('resource', []);

  resource.factory('ResourceGallery', function($http) {
    var api;
    api = {
      getFeatured: function(cb) {
        return $http.get("api/featured-items").success(function(data) {
          return cb(data);
        });
      },
      getStatsByCategory: function(cb) {
        return $http.get("api/stats").success(function(data) {
          return cb(data);
        });
      }
    };
    return api;
  });

  resource.factory('ResourceUser', function($http) {
    var api;
    api = {
      getFeatured: function(cb) {
        return $http.get("api/user/featured").success(function(data) {
          return cb(data);
        });
      },
      getCurrentUserData: function(cb) {
        return $http.get("/api/user-data").success(function(data) {
          return cb(data);
        });
      }
    };
    return api;
  });

}).call(this);
