'use strict';

angular.module('surveyApp')
  .controller('SurveyCtrl', function ($state, surveydata, logger, $stateParams) {
    var vm = this;
    var page_type = surveydata.getPageType();
    var item_type = this.itemType = surveydata.getItemType();

    this.data = {};

    this.currentPage = surveydata.getCurrentPage();
    this.page = '';
    this.file = {};
    this.showError = false;

    this.showPage = showPage;
    this.showItem = showItem;
    this.getFile = surveydata.getFile;
    this.getNumber = getNumber;
    this.nextPage = nextPage;
    this.showNext = showNext;
    this.returnToList = returnToList;
    this.prevPage = prevPage;
    this.showPrev = showPrev;
    this.getWidth = getWidth;
    this.log = logger.info;

    activate();

    //////////////////////////

    function activate() {
      surveydata.getCurrentSurvey($stateParams.surveyId, function(data){
        if (!data) { this.showError = true;}
        vm.data = data;
        showPage();
      });
    }

    function showPage(index) {
      if (vm.data.pages.length) {
        var currentPage = vm.data.pages[index || 0];
        vm.currentPage = currentPage;
        switch (currentPage.pageType.val) {
        case page_type.description.val:
          vm.page = 'app/survey/templates/description.html';
          break;
        case page_type.multimedia.val:
          vm.page = 'app/survey/templates/multimedia.html';
          if (currentPage.fileId) {
            vm.getFile(currentPage.fileId)
              .then(function (data) {
                if (data && data.file) {
                  vm.file.data = data.file.img;
                  vm.file.type = data.file.mimetype;
                }
              });
          }
          break;
        case page_type.questionary.val:
          var viewOrder = 0;
          if (vm.currentPage.items) {
            vm.currentPage.items.forEach(function(item){
              switch (item.itemType.val) {
                case item_type.title.val:
                case item_type.caption.val:
                  break;
                case item_type.semantics.val:
                  ++viewOrder;
                  break;
                case item_type.likerts.val:
                  item.viewOrder = ++viewOrder;
                  viewOrder += item.content.split('\n').length -1;
                  break;
                default:
                  item.viewOrder = ++viewOrder;
              }
            });
          }
          vm.page = 'app/survey/templates/questionary.html';
          break;
        }
      } else {
        logger.waring('No pages to render, returning to main route.');
        $state.go('main');
      }
    }

    function showItem(item) {
      switch (item.itemType.val) {
      case item_type.title.val:
      case item_type.caption.val:
        return 'text.html';
      case item_type.choice.val:
        if (item.options.otherOption && (_.last(item.options.list).name !== '其他')) {
          item.options.list.push({ index: item.options.list.length, name: '其他' });
        };
        return 'choice.html';
      case item_type.blank.val:
      case 'fill-in-blank':
        return 'blank.html';
      case item_type.likert.val:
      case item_type.likerts.val:
        if (!item.headers) item.headers = generateHeader(item.options.scales, 'likert');
        if (!item.questions) item.questions = processLikertScale(item);
        return 'likert.html';
      case item_type.semantic.val:
      case item_type.semantics.val:
        if (!item.headers) item.headers = generateHeader(item.options.scales, 'semantic');
        if (!item.questions) item.questions = processSemanticScale(item);
        return 'semantic.html';
      }
    }

    function getNumber(num) {
      return new Array(num);
    }

    function nextPage() {
      vm.showPage(vm.currentPage.pageOrder);
    }

    function showNext() {
      return (vm.currentPage.pageOrder === vm.data.pages.length);
    }

    function returnToList() {
      $state.go('main');
    }

    function prevPage() {
      vm.showPage(vm.currentPage.pageOrder - 2);
    }

    function showPrev() {
      return (vm.currentPage.pageOrder - 2) < 0;
    }

    function generateHeader(scales, type) {
      var headers = generateScales(scales);
      headers.forEach(function(scale, index){
        var content = '';
        if (type === 'likert') {
          _.forEach(generateScaleOption(scale), function(char){ content += char +'<br>'; });
        } else content = index + 1 + '';
        headers[index] = { val: scale, name: content };
      });
      return headers;
    }

    function generateScaleOption(scale) {
      switch(scale) {
        case 1:
          return '非常不同意';
        case 2:
          return '不同意';
        case 3:
          return '有點不同意';
        case 4:
          return '沒意見';
        case 5:
          return '有點同意';
        case 6:
          return '同意';
        case 7:
          return '非常同意';
      }
    }

    function processLikertScale(item) {
      var content = item.content,
          scales = item.options.scales,
          questions = content.split('\n');
      questions.forEach(function(question, index){
        questions[index] = {
          order: index + 1,
          content: question,
          selected: '',
          options: generateScales(scales)
        };
      });
      return questions;
    }

    function processSemanticScale(item) {
      var content = item.content,
          scales = item.options.scales,
          questions = content.split('\n');
      if (questions[0].search(',') === -1) {
        item.title = questions.shift();
      }
      questions.forEach(function(question, index){
        questions[index] = {
          order: index + 1,
          content: question.split(','),
          selected: '',
          options: generateScales(scales)
        };
      });
      return questions;
    }

    function generateScales(scales) {
      var data = [1,2,3,4,5,6,7];
      switch(scales) {
        case 7:
          return data;
        case 6: // 1,2,3,5,6,7
          data.splice(3,1);
          return data;
        case 5: // 2,3,4,5,6
          return data.slice(1, -1);
        case 4: // 2,3,5,6
          data = data.slice(1, -1);
          data.splice(2,1);
          return data;
        case 3: // 3,5,6
          return data.slice(2,-2);
      }
    }

    function getWidth(scales) {
      return 50/scales + '%';
    }

  });
