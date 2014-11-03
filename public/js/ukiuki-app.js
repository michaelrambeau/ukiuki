(function() {
  window.app = angular.module("app", ["resource", "ui.router", "ct.ui.router.extras", "angularFileUpload", "cloudinary"]);

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
      "user": {
        url: "/user/:username",
        views: {
          mypage: {
            templateUrl: "html/user/index.html",
            controller: 'UserController'
          }
        },
        deepStateRedirect: false,
        sticky: false
      },
      "user.galleries": {
        url: "/galleries",
        templateUrl: "html/user/user-galleries.html"
      },
      "user.home": {
        url: "/home",
        templateUrl: "html/user/home.html"
      },
      "user.blog": {
        url: "/blog",
        templateUrl: "html/user/blog.html"
      },
      "user.galleries.upload": {
        url: "/upload",
        templateUrl: "html/user/upload-gallery.html",
        controller: 'MyPageController'
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
        controller: 'GalleryUploadController'
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
  app.directive('focus', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        return element[0].focus();
      }
    };
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
      scope: {
        user: '='
      },
      transclude: true,
      template: '<div ng-transclude></div>',
      replace: true,
      controller: function($scope) {
        console.info("tabs ctrl", $scope.user);
        return this.user = $scope.user;
      },
      link: function(scope, element, attrs, tabsCtrl) {
        return console.info("user fom link=", scope.user);
      }
    };
  });

  app.directive('tab', function() {
    return {
      restrict: 'E',
      require: '^tabs',
      transclude: true,
      replace: true,
      scope: {
        state: '@',
        user: '='
      },
      template: '<a href="" ui-sref="{{state}}" ng-class="{selected: currentState.includes(state)}" ng-transclude></a>',
      controller: function($scope, $rootScope) {
        $rootScope.$watch('$state.current.name', function() {
          console.log($rootScope.$state.current.name);
          return $scope.currentState = $rootScope.$state;
        });
      },
      link: function(scope, element, attrs, tabsCtrl) {
        return console.info("user=", tabsCtrl.user);
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

  app.controller("BrowseController", function($scope, ResourceGallery) {
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
    $(".filter-bar-toggle").click(function() {
      $sidebar.sidebar("toggle");
    });
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
      ResourceGallery.getStatsByCategory(function(data) {
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
    ResourceGallery.getFeatured(function(data) {
      $scope.galleries = data.galleries;
      $scope.categories = data.categories;
      console.info($scope.galleries.length, "items loaded");
      getStatsByCategory();
      $scope.loading = false;
    });
  });

}).call(this);

(function() {
  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
    return true;
  });

  app.factory('myHttpInterceptor', function($q) {
    var api, hideLoading, n, showLoading;
    n = 0;
    hideLoading = function() {
      n--;
      if (n > 0) {
        return console.log("A previous request is still pending...");
      } else {
        return $("#spinner").removeClass('active');
      }
    };
    showLoading = function() {
      n++;
      return $("#spinner").addClass('active');
    };
    api = {
      request: function(config) {
        if (config.showLoading !== false) {
          showLoading();
        }
        return config;
      },
      requestError: function(rejection) {
        return $q.reject(rejection);
      },
      response: function(response) {
        hideLoading();
        return response;
      },
      responseError: function(rejection) {
        hideLoading();
        return $q.reject(rejection);
      }
    };
    return api;
  });

}).call(this);

(function() {
  app.controller("SignupController", function($scope, $http, $state) {
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
        $scope.$emit('login', data);
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
      var formData, q;
      $scope.status = "LOADING";
      formData = {
        email: $scope.email,
        password: $scope.password
      };
      q = $http({
        url: "/api/signin",
        method: "POST",
        data: formData,
        showLoading: true
      });
      q.success(function(data) {
        $scope.status = "SUCCESS";
        console.log(data);
        $scope.$emit('login', data);
      });
      q.error(function(data) {
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

  app.controller("MainController", function($scope, $state, ResourceUser, $http) {
    var event, events, _i, _len;
    console.log("Main controller");
    $scope.currentUser = null;
    $scope.getUserData = function() {
      return ResourceUser.getCurrentUserData(function(data) {
        console.info("Connected user", data.user);
        if (data.user != null) {
          $scope.currentUser = data.user;
          return $scope.$broadcast('authenticated');
        }
      });
    };
    $scope.getUserData();
    $scope.isLoggedin = function() {
      return $scope.currentUser != null;
    };
    $scope.signout = function() {
      $http.post("/api/signout").success(function(data) {
        $scope.currentUser = null;
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
    $scope.$on("login", function(ev, data) {
      console.info(data.user, 'is logged-in.');
      $scope.currentUser = data.user;
      $loginBlock.collapse("hide");
      return $state.go('mypage.galleries');
    });
    return ResourceUser.getFeatured(function(data) {
      return $scope.featuredUsers = data.users;
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
      return $http.get("api/user-galleries/" + $scope.currentUser._id).success(function(data) {
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
    if ($scope.isLoggedin()) {
      return $scope.getGalleries();
    }
  });

}).call(this);

(function() {
  app.controller("GalleryUploadController", function($scope, $upload, $http, $state, Categories) {
    var config;
    console.log("GalleryUploadController", $scope.currentUser);
    $scope.status = 0;
    $scope.progress = 0;
    config = {
      cloud_name: 'ukiukidev',
      upload_preset: 'se4iauwt'
    };
    Categories.getAll(function(data) {
      return $scope.categories = data;
    });
    $.cloudinary.config('cloud_name', config.cloud_name);
    $.cloudinary.config('upload_preset', config.upload_preset);
    $scope.onFileSelect = function($files) {
      var file, tags, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = $files.length; _i < _len; _i++) {
        file = $files[_i];
        tags = [$scope.currentUser.username, $scope.category, 'NEW'];
        $scope.upload = $upload.upload({
          showLoading: false,
          url: 'https://api.cloudinary.com/v1_1/' + config.cloud_name + '/upload',
          data: {
            upload_preset: config.upload_preset,
            tags: tags.join(',')
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
          if (data.error) {
            $scope.status = 3;
            return $scope.error = data.error;
          } else {
            $scope.status = 2;
            return $scope.gallery = data;
          }
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

(function() {
  app.factory("User", function(ResourceUser) {
    var api;
    api = {
      getFeatured: function(cb) {
        return ResourceUser.getFeatured(function(data) {
          return cb(data.users);
        });
      }
    };
    return api;
  });

}).call(this);

(function() {
  app.controller('UserController', function($scope, $http, $stateParams) {
    var username;
    username = $stateParams.username;
    return $http.get('/api/user-data/' + username).success(function(data) {
      $scope.galleries = data.galleries;
      return $scope.user = data.user;
    });
  });

}).call(this);
