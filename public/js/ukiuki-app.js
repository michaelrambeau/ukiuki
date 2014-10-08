(function() {
  window.app = angular.module("app", ["ui.router", "ct.ui.router.extras", "angularFileUpload", "cloudinary"]);

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
      },
      "mypage": {
        url: "/mypage",
        views: {
          mypage: {
            templateUrl: "html/mypage/index.html"
          }
        },
        deepStateRedirect: true,
        sticky: true
      },
      "mypage.galleries": {
        url: "/galleries",
        templateUrl: "html/mypage/user-galleries.html",
        controller: 'MyGalleriesController'
      },
      "mypage.home": {
        url: "/home",
        templateUrl: "html/mypage/home.html"
      },
      "mypage.blog": {
        url: "/blog",
        templateUrl: "html/mypage/blog.html"
      },
      "mypage.galleries.upload": {
        url: "/upload",
        templateUrl: "html/mypage/upload-gallery.html",
        controller: 'MyPageController'
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
  app.directive('gallery', function() {
    return {
      restrict: 'AE',
      scope: {
        gallery: "=data"
      },
      controller: function($scope) {
        return $scope.getThumbnailUrl = function(gallery) {
          var re, url;
          if (gallery.image == null) {
            return "";
          }
          url = gallery.image.url;
          re = /\/v\d*\//;
          return url.replace(re, "/t_ukiuki2/");
        };
      },
      template: '<div class="col-sm-6 col-md-4 col-lg-3"><img class="img-responsive gallery" src="/images/gallery.gif" ng-src="{{getThumbnailUrl(gallery)}}" alt="{{gallery.title}}")></div>'
    };
  });

}).call(this);

(function() {
  app.directive('tabs', function() {
    return {
      restrict: 'E',
      scope: {},
      transclude: true,
      template: '<div ng-transclude></div>',
      replace: true
    };
  });

  app.directive('tab', function() {
    return {
      restrict: 'E',
      require: '^tabs',
      transclude: true,
      replace: true,
      scope: {
        state: '@'
      },
      template: '<a href="" ui-sref="{{state}}" ng-class="{selected: currentState.includes(state)}" ng-transclude></a>',
      controller: function($scope, $rootScope) {
        $rootScope.$watch('$state.current.name', function() {
          console.log($rootScope.$state.current.name);
          return $scope.currentState = $rootScope.$state;
        });
      }
    };
  });

}).call(this);

(function() {
  var adjustHeightOLD;

  adjustHeightOLD = function() {
    var h;
    h = $("img.gallery:first").height();
    $(".gallery.info").height(h);
  };

  app.controller("BrowseController", function($scope, $http) {
    var $sidebar, findCategory, getStatsByCategory, i;
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
      $http.get("api/featured-items").success(function(data) {
        $scope.galleries = data.galleries;
        $scope.categories = data.categories;
        $scope.loading = false;
        console.info($scope.galleries.length, "items loaded");
        getStatsByCategory();
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
  app.config(function($httpProvider) {
    var spinnerFunction;
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    spinnerFunction = function(data, headersGetter) {
      $("#spinner").addClass('active');
      return data;
    };
    return $httpProvider.defaults.transformRequest.push(spinnerFunction);
  });

  app.factory("myHttpInterceptor", function($q, $window) {
    var api, cb1, cb2, hideLoading;
    hideLoading = function() {
      return $("#spinner").removeClass('active');
    };
    cb1 = function(response) {
      hideLoading();
      return response;
    };
    cb2 = function(response) {
      hideLoading();
      return $q.reject(response);
    };
    api = function(promise) {
      return promise.then(cb1, cb2);
    };
    return api;
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
        $scope.$emit('login', data);
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
  var $loginBlock, $loginCloseBar, $searchbar, $sidebar;

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

  app.controller("MainController", function($scope, $http, $state) {
    var event, events, _i, _len;
    console.log("Main controller");
    $scope.user = null;
    $scope.getUserData = function() {
      return $http.get("/api/user-data").success(function(data) {
        console.info("Connected user", data.user);
        if (data.user != null) {
          $scope.user = data.user;
          return $scope.$broadcast('authenticated');
        }
      });
    };
    $scope.getUserData();
    $scope.isLoggedin = function() {
      return $scope.user != null;
    };
    $scope.signout = function() {
      $http.post("/api/signout").success(function(data) {
        $scope.user = null;
        console.log("Disconnected.");
        $state.go("browse");
      }).error(function(data) {
        console.log("Sign out error!");
      });
    };
    events = ["signup-submission", "signin-submission", "upload"];
    for (_i = 0, _len = events.length; _i < _len; _i++) {
      event = events[_i];
      $scope.$on(event, function(ev, data) {
        if (ev.targetScope === $scope) {
          return;
        }
        console.log("MainController on event", ev.name);
        $scope.$broadcast(ev.name, data);
      });
    }
    return $scope.$on("login", function(ev, data) {
      console.info(data.user, 'is logged-in.');
      $scope.user = data.user;
      $loginBlock.collapse("hide");
      return $state.go('mypage.galleries');
    });
  });

}).call(this);

(function() {


}).call(this);

(function() {
  app.controller('MyGalleriesController', function($scope, $http) {
    console.log("MyGalleries controller");
    $scope.getGalleries = function() {
      console.log("Loading user's galleries...");
      return $http.get("api/user-galleries/" + $scope.user._id).success(function(data) {
        $scope.galleries = data.galleries;
        return console.info($scope.galleries.length, "User galleries loaded");
      });
    };
    $scope.$on('authenticated', function() {
      return $scope.getGalleries();
    });
    $scope.$on('upload', function() {
      return $scope.getGalleries();
    });
    if ($scope.user) {
      return $scope.getGalleries();
    }
  });

}).call(this);

(function() {
  app.controller("MyPageController", function($scope, $upload, $http, $state, Categories) {
    var config, options;
    console.log("MyPageController", $scope.user);
    config = {
      cloud_name: 'ukiukidev',
      upload_preset: 'se4iauwt'
    };
    options = {
      title: 'Test mike ' + new Date(),
      status: 0,
      progress: 0
    };
    Categories.getAll(function(data) {
      return $scope.categories = data;
    });
    $.cloudinary.config('cloud_name', config.cloud_name);
    $.cloudinary.config('upload_preset', config.upload_preset);
    $scope.onFileSelect = function($files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = $files.length; _i < _len; _i++) {
        file = $files[_i];
        $scope.upload = $upload.upload({
          url: 'https://api.cloudinary.com/v1_1/' + config.cloud_name + '/upload',
          data: {
            upload_preset: config.upload_preset,
            tags: $scope.user.username + " " + $scope.category
          },
          file: file
        });
        $scope.upload.progress(function(evt) {
          var p;
          $scope.status = evt.loaded === evt.total ? 2 : 1;
          p = parseInt(100.0 * evt.loaded / evt.total);
          $scope.progress = p;
          return console.log('percent: ' + p);
        });
        _results.push($scope.upload.success(function(data, status, headers, config) {
          $scope.status = 2;
          return $scope.gallery = data;
        }));
      }
      return _results;
    };
    $scope.isFormValid = function() {
      if ($scope.uploadForm.$valid && $scope.status === 2) {
        return true;
      } else {
        return false;
      }
    };
    $scope.save = function() {
      var data, url;
      console.info("Saving the gallery...");
      url = "/api/upload-gallery";
      data = {
        title: $scope.title,
        category: $scope.category,
        image: JSON.stringify($scope.gallery)
      };
      return $http.post(url, data).success(function(result) {
        console.info("The gallery has been uploaded!");
        $scope.$emit("upload", data);
        return $state.go("mypage.galleries");
      });
    };
    return $scope.test = function() {
      return console.info($scope.isFormValid());
    };
  });

}).call(this);

(function() {
  app.factory("Categories", function($http) {
    var api, categories;
    categories = {};
    api = {
      getAll: function(cb) {
        return $http.get("api/categories").success(function(data) {
          categories = data.categories;
          return cb(categories);
        });
      }
    };
    return api;
  });

}).call(this);
