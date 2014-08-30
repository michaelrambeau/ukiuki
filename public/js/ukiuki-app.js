(function() {
  window.app = angular.module("app", ["ui.router", "ct.ui.router.extras"]);

  app.run([
    "$rootScope", "$state", "$stateParams", function($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      return $rootScope.$stateParams = $stateParams;
    }
  ]);

  app.config(function($stateProvider, $urlRouterProvider) {
    var key, options, states, _results;
    $urlRouterProvider.otherwise("/browse");
    states = {
      "browse": {
        url: "/browse",
        views: {
          browse: {
            template: $("#browse-items-block").html(),
            controller: "BrowseController"
          }
        },
        deepStateRedirect: true,
        sticky: true
      },
      "whatisukiuki": {
        url: "/whatisukiuki",
        views: {
          whatisukiuki: {
            templateUrl: "html/whatisukiuki.html"
          }
        },
        deepStateRedirect: true,
        sticky: true
      }
    };
    _results = [];
    for (key in states) {
      options = states[key];
      _results.push($stateProvider.state(key, options));
    }
    return _results;
  });

}).call(this);

(function() {
  var $loginBlock, $loginCloseBar, $searchbar, $sidebar, adjustHeightOLD;

  adjustHeightOLD = function() {
    var h;
    h = $("img.gallery:first").height();
    $(".gallery.info").height(h);
  };

  $sidebar = void 0;

  $searchbar = void 0;

  $loginBlock = void 0;

  $loginCloseBar = void 0;

  $(document).ready(function() {
    $searchbar = $(".uki-navbar");
    $loginBlock = $("#login-block");
    $loginCloseBar = $(".leftbar,.topbar");
    $loginBlock.on("show.bs.collapse", function() {
      $searchbar.hide();
    });
    $loginBlock.on("shown.bs.collapse", function() {
      $loginBlock.find("input:first").focus();
    });
    $loginBlock.on("hide.bs.collapse", function() {
      $searchbar.show();
    });
    return $loginCloseBar.click(function() {
      $loginBlock.collapse("hide");
    });
  });

  app.controller("BrowseController", function($scope, $http) {
    var findCategory, getStatsByCategory, i;
    findCategory = function(code) {
      var found;
      found = null;
      $scope.categories.forEach(function(cat) {
        if (code === cat.value) {
          found = cat;
        }
      });
      return found;
    };
    console.log("BrowseController");
    $scope.galleries = [];
    i = 0;
    while (i < 10) {
      $scope.galleries.push({
        title: i
      });
      i++;
    }
    console.log($scope.galleries.length);
    $scope.loading = true;
    $sidebar = $(".ui.sidebar:visible");
    $sidebar.sidebar({
      debug: true
    });
    $(".navbar-toggle").click(function() {
      $sidebar.sidebar("toggle");
    });
    if (true) {
      $http.get("api/featuredItems").success(function(data) {
        $scope.galleries = data.galleries;
        $scope.categories = data.categories;
        $scope.loading = false;
        console.info($scope.galleries.length, "items loaded");
        getStatsByCategory();
        $scope.user = data.user;
      });
    }
    $scope.searchFilter = function(item) {
      var categoryFilter, descriptionFilter, titleFilter;
      titleFilter = new RegExp($scope.search.text, "i").test(item.title);
      descriptionFilter = RegExp($scope.search.text, "i").test(item.description);
      categoryFilter = ($scope.search.category === "*") || (item.category === $scope.search.category);
      return categoryFilter && (titleFilter || descriptionFilter);
    };
    $scope.formatDate = function(source) {
      var dateOnly, ymd;
      dateOnly = source.split(" ")[0];
      ymd = dateOnly.split("-");
      return moment(new Date(ymd[0], ymd[1], ymd[2])).fromNow();
    };
    $scope.getThumbnailUrl = function(gallery) {
      var re, url;
      url = gallery.image.url;
      re = /\/v\d*\//;
      return url.replace(re, "/t_ukiuki2/");
    };
    $scope.categories = [];
    $scope.search = {
      category: "*",
      text: ""
    };
    getStatsByCategory = function() {
      $http.get("api/stats").success(function(data) {
        data.categories.forEach(function(cat) {
          var found;
          found = findCategory(cat._id);
          if (found) {
            found.total = cat.total;
          }
        });
      });
    };
    $scope.setCategory = function(id) {
      $scope.search.category = id;
    };
  });

}).call(this);

(function() {
  app.controller("SignupController", function($scope, $http) {
    console.log("Signup controller");
    $scope.status = "";
    $scope.submit = function() {
      $scope.submitted = true;
      $scope.$emit("signup-submission");
      $scope.signupForm.$valid && $scope.signup();
    };
    $scope.signup = function() {
      var formData;
      $scope.status = "LOADING";
      formData = {
        email: $scope.email,
        username: $scope.username,
        password: $scope.password
      };
      $http.post("/api/signup", formData).success(function(data) {
        $scope.status = "SUCCESS";
        console.log(data);
      }).error(function(data) {
        $scope.status = "ERROR";
        $scope.error = data.error.key;
      });
    };
    $scope.$on("signin-submission", function(data) {
      $scope.status = "";
    });
  });

  app.controller("SigninController", function($scope, $http) {
    console.log("Signin controller");
    $scope.status = "";
    $scope.submitted = false;
    $scope.submit = function() {
      $scope.submitted = true;
      $scope.$emit("signin-submission");
      $scope.signinForm.$valid && $scope.signin();
    };
    $scope.signin = function() {
      var formData;
      $scope.status = "LOADING";
      formData = {
        email: $scope.email,
        password: $scope.password
      };
      $http.post("/api/signin", formData).success(function(data) {
        $scope.status = "SUCCESS";
        console.log(data);
        $scope.$parent.user = data.user;
        $loginBlock.collapse("hide");
      }).error(function(data) {
        $scope.status = "ERROR";
      });
    };
    $scope.$on("signup-submission", function(data) {
      $scope.status = "";
    });
  });

}).call(this);

(function() {
  app.controller("MainController", function($scope, $http) {
    console.log("Main controller");
    $scope.user = null;
    $scope.signout = function() {
      $http.post("/api/signout").success(function(data) {
        $scope.user = null;
        console.log("Disconnected.");
      }).error(function(data) {
        console.log("Sign out error!");
      });
    };
    $scope.$on("signup-submission", function(ev, data) {
      if (ev.targetScope === $scope) {
        return;
      }
      console.log("on event");
      $scope.$broadcast("signup-submission", data);
    });
    $scope.$on("signin-submission", function(ev, data) {
      console.log("on event");
      if (ev.targetScope === $scope) {
        return;
      }
      $scope.$broadcast("signin-submission", data);
    });
  });

}).call(this);
