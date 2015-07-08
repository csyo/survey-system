'use strict';

angular.module('surveyApp')
  .controller('MainCtrl', function($state, surveydata, $modal, $window, $http, Auth, logger) {

    var vm = this;
    this.add = add;
    this.edit = edit;
    this.remove = remove;
    this.preview = preview;
    this.generateUrl = generateUrl;
    this.toggleStatus = toggleStatus;
    this.setPermission = setPermission;
    this.preventEdit = preventEdit;
    this.getResult = getResult;
    this.getCsvHeaders = function(data) {return _.keys(data); };

    this.rows = surveydata.getSurveys();
    this.displayed = [].concat(this.rows);
    this.isLoading = false;

    /* fetch data only when loading the first time */
    if (!vm.rows.length) {
      vm.isLoading = true;
      activate();
    }

    ////////////

    function activate() {
      return fetchSurveys()
        .then(function() {
          logger.info('Activated Main View');
          vm.isLoading = false;
        });
    }

    function fetchSurveys() {
      return surveydata.fetchSurveys()
        .then(function(surveys) {
          vm.rows = surveys;
          return vm.rows;
        });
    }

    function toggleStatus(row) {
      row.status = !row.status;
      $http.patch('/api/surveys/' + row._id, row)
        .success(function(data) {
          if (data.status !== row.status) { logger.error('Status doesn\'t match!'); } else { logger.info('Patch completed'); }
        })
        .error(function(err) {
          logger.error(err);
        });
    }

    function add() {
      $state.go('editor'); // change to editor view to create survey
    }

    function edit(index) {
      // update current page info
      surveydata.setCurrentSurvey(index);
      // change route to editing state
      $state.go('editor');
    }

    function remove(index) {
      var confirm = $modal.open({
        size: 'sm',
        animation: false,
        windowClass: 'center-modal',
        templateUrl: 'app/editor/confirm/confirm.html',
        controller: 'ConfirmCtrl',
        controllerAs: 'confirm',
        resolve: {
          title: function() { return vm.rows[index].title; }
        }
      });
      confirm.result.then(function(remove) {
        if (remove) {
          surveydata.removeSurvey(vm.rows[index])
            .then(function() {
              vm.rows.splice(index, 1);
              vm.rows.forEach(function(row, rowIndex) {
                row.index = rowIndex;
              });
            });
        }
      });
    }

    function preview(surveyId) {
      surveydata.setSurveyId(surveyId);
      // change route to survey preview
      $state.go('survey');
    }

    function generateUrl(row) {
      var url = 'https://nckuba-survey.herokuapp.com/' + row._id;
      $window.open(url, '_blank');
    }

    function setPermission(row) {
      var permission = $modal.open({
        animation: false,
        templateUrl: 'app/main/permission/permission.html',
        controller: 'PermissionCtrl',
        controllerAs: 'permission',
        resolve: {
          permissionList: function() { return row.permissionList || []; }
        }
      });

      permission.result.then(function(permissionList) {
        row.permissionList = permissionList.map(function(item) { return item.name; });
        $http.patch('/api/surveys/' + row._id, row)
          .success(function(result) {
            console.info(result);
          })
          .error(function(err) {
            logger.error(err);
          });
      });
    }

    function preventEdit(row) {
      var user = Auth.getCurrentUser().name;
      if (user === 'Admin') { return true; }
      else { return row.account === user; }
    }

    function getResult(row) {
      row.results = null;
      $http.get('/api/results/' + row._id)
        .success(function(response) {
          console.info(response);
          row.results = response.map(function(data) {
            var csv = {};
            csv.clientIp = data.clientIp;
            data.results.forEach(function(result){
              csv[result.order] = result.answer;
            });
            return csv;
          });

        });
    }

  });
