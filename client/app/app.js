'use strict';

angular.module('surveyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'smart-table',
  'xeditable',
  'colorpicker.module',
  'textAngular',
  'ngFileUpload',
  'pasvaz.bindonce',
  'toastr'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, editableOptions, logger) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
    /**
     * Route cancellation:
     * On routing error, go to the dashboard.
     * Provide an exit clause if it tries to do it twice.
     */
    var handlingRouteChangeError = false;
    $rootScope.$on('$stateChangeError',
        function(event, current, previous, rejection) {
            if (handlingRouteChangeError) { return; }
            handlingRouteChangeError = true;
            var destination = (current && (current.title ||
                current.name || current.loadedTemplateUrl)) ||
                'unknown target';
            var msg = 'Error routing to ' + destination + '. ' +
                (rejection.msg || '');

            /**
             * Optionally log using a custom service or $log.
             * (Don't forget to inject custom service)
             */
            logger.warning(msg, [current]);

            /**
             * On routing error, go to another route/state.
             */
            $location.path('/');

        }
    );
    // Set theme for angular-editable
    editableOptions.theme = 'bs3';
    editableOptions.blur = 'submit';
  });
