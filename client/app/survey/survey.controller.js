'use strict';

angular.module('surveyApp')
  .controller('SurveyCtrl', function ($state, surveydata) {
    var survey = this;

    this.data = surveydata.getCurrentSurvey();
    this.currentPage = surveydata.getCurrentPage();

    this.page = '';

    var page_type = surveydata.getPageType();
    this.showPage = function (index){
      var currentPage = survey.data.pages[index || 0];
      survey.currentPage = currentPage;
      switch (currentPage.pageType.val) {
        case page_type.description.val:
          survey.page = 'app/survey/templates/description.html';
          break;
        case page_type.multimedia.val:
          survey.page = 'app/survey/templates/multimedia.html';
          break;
        case page_type.questionary.val:
          survey.page = 'app/survey/templates/questionary.html';
          break;
      }
    };

    this.showPage();

    var item_type = surveydata.getItemType();
    this.showItem = function (item) {
      switch (item.itemType.val) {
        case item_type.title.val:
        case item_type.caption.val:
          return 'text.html';
        case item_type.choice.val:
          return 'choice.html';
        case item_type['fill-in-blank'].val:
          return 'fill-in-blank.html';
        case item_type.likert.val:
        case item_type['likert-group'].val:
          item.options.data = generateScales(item.options.scales);
          return 'likert.html';
        case item_type.semantic.val:
        case item_type['semantic-group'].val:
          item.options.data = generateScales(item.options.scales);
          return 'semantic.html';
      }
    };
    this.getNumber = function(num){
      return new Array(num);
    };

    this.nextPage = function (){
      survey.showPage(survey.currentPage.pageOrder);
    };
    this.showNext = function (){
      return (survey.currentPage.pageOrder === survey.data.pages.length);
    };
    this.returnToList = function (){
      $state.go('main');
    };
    this.prevPage = function (){
      survey.showPage(survey.currentPage.pageOrder - 2);
    };
    this.showPrev = function (){
      return (survey.currentPage.pageOrder - 2) < 0;
    };

    function generateScales(scales) {
      var data = [];
      for (var i = 0; i < scales; i++) {
        data[i] = {val:i+1, selected: false};
      }
      return data;
    }
  });
