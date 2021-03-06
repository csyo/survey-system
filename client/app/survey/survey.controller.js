'use strict';

angular.module('surveyApp')
  .controller('SurveyCtrl', function($state, surveydata, scalesGenerator, logger, $timeout, $sce) {
    var vm = this;
    var pageType = surveydata.getPageType();
    var itemType = this.itemType = surveydata.getItemType();

    /** page data storage **/
    this.page = '';
    this.file = null;
    this.pages = [];
    this.currentPage = {};

    /** for page content **/
    this.showPage = showPage;
    this.showError = false;
    this.showItem = showItem;
    this.showWaring = false;
    this.saveResult = saveResult;
    this.getFile = surveydata.getFile;
    this.isLoading = false;

    /** for page counter **/
    this.counterDisplay = '';
    this.counter = 0;
    this.checkedQueue = [];
    this.watchCheckbox = watchCheckbox;

    /** for page navigation**/
    this.nextEnabled = true;
    this.isEnd = false;
    this.nextPage = nextPage;
    this.showNext = showNext;
    this.returnToList = returnToList;
    this.prevPage = prevPage;
    this.showPrev = showPrev;
    this.log = logger.info;

    activate();

    //////////////////////////

    function activate() {
      surveydata.getCurrentSurvey({view: true})
        .then(function(data) {
          if (!data) { vm.showError = true;} else { vm.pages = data.pages; }
          showPage();
        });
    }

    function showPage(index) {
      if (vm.pages.length) {
        vm.currentPage = vm.pages[index || 0];
        vm.nextEnabled = true;
        vm.isEnd = vm.currentPage.pageOrder === vm.pages.length;
        switch (vm.currentPage.pageType.val) {
        case pageType.description.val:
          vm.page = 'app/survey/templates/description.html';
          break;
        case pageType.multimedia.val:
          var file = vm.currentPage.file;
          vm.page = 'app/survey/templates/multimedia.html';
          if (file.type === 'image') {
            vm.isLoading = true;
            vm.getFile(vm.currentPage.file.imgId)
              .then(function(data) {
                vm.isLoading = false;
                if (data && data.file) {
                  vm.file = 'data:' + data.file.mimetype + ';base64,' + data.file.img;
                }
              });
          } else if (file.type === 'video') {
            vm.file = $sce.trustAsHtml(file.videoUrl);
          } else { vm.file = null; }
          break;
        case pageType.questionary.val:
          var viewOrder = 0;
          if (vm.currentPage.items) {
            vm.currentPage.items.forEach(function(item) {
              switch (item.itemType.val) {
                case itemType.title.val:
                case itemType.caption.val:
                  break;
                case itemType.semantics.val:
                  item.viewOrder = ++viewOrder;
                  break;
                case itemType.likerts.val:
                  item.viewOrder = ++viewOrder;
                  viewOrder += item.content.match(/\n/) ? item.content.split('\n').length - 1 :
                    item.content.split(/<br>/).length - 1;
                  break;
                default:
                  item.viewOrder = ++viewOrder;
              }
            });
          }
          vm.page = 'app/survey/templates/questionary.html';
          break;
        }
        vm.counter = vm.currentPage.pageCount;
        vm.showNext();
      } else {
        logger.waring('No pages to render, returning to main route.');
        $state.go('main');
      }
    }

    function showItem(item) {
      switch (item.itemType.val) {
      case itemType.title.val:
      case itemType.caption.val:
        return 'text.html';
      case itemType.choice.val:
        if (item.options.otherOption && (_.last(item.options.list).name !== '其他')) {
          item.options.list.push({index: item.options.list.length, name: '其他'});
        }
        return 'choice.html';
      case itemType.blank.val:
      case 'fill-in-blank':
        return 'blank.html';
      case itemType.likert.val:
      case itemType.likerts.val:
        if (!item.headers) { item.headers = item.options.list ? item.options.list : scalesGenerator.getHeader(item.options.scales, 'likert'); }
        if (!item.questions) { item.questions = scalesGenerator.getLikerts(item); }
        return 'likert.html';
      case itemType.semantic.val:
      case itemType.semantics.val:
        if (!item.headers) { item.headers = item.options.list ? item.options.list : scalesGenerator.getHeader(item.options.scales, 'semantic'); }
        if (!item.questions) { item.questions = scalesGenerator.getSemantics(item); }
        return 'semantic.html';
      }
    }

    function saveResult(valid) {
      if (valid) {
        vm.showWaring = false;
        // generate results item
        var results = [];
        vm.pages.forEach(function(page) {
          if (page.pageType.val === pageType.questionary.val) {
            /*jshint -W030*/
            page.items && page.items.forEach(function(item) {
              switch (item.itemType.val) {
                case itemType.blank.val:
                  results.push({
                    order: page.pageOrder + '-' + item.viewOrder,
                    question: item.content,
                    answer: item.input
                  });
                  break;
                case itemType.choice.val:
                  results.push({
                    order: page.pageOrder + '-' + item.viewOrder,
                    question: item.content,
                    answer: choiceAnswer(item, item.options.typeName)
                  });
                  break;
                case itemType.likert.val:
                case itemType.likerts.val:
                case itemType.semantic.val:
                case itemType.semantics.val:
                  item.questions.forEach(function(question) {
                    results.push({
                      order: page.pageOrder + '-' + item.viewOrder,
                      question: question.content.toString(),
                      answer: question.selected
                    });
                  });
                  break;
                default:
                  break;
              }
            });
          }
        });
        logger.info(results);
        surveydata.saveResult(results)
          .then(function(data) {
            logger.info(data);
            vm.showSuccessMsg = true;
          });
      } else {
        vm.showWaring = true;
      }
    }

    function choiceAnswer(item, typeName) {
      if (typeName === 'radio') {
        return item.options.selected;
      } else if (typeName === 'checkbox') {
        var answers = [];
        for (var key in item.options.option) {
          if (item.options.option[key]) { answers.push(item.options.list[key]); }
        }
        return answers;
      }
    }

    function nextPage(invalid) {
      if (invalid) {
        vm.showWaring = true;
      } else {
        // clear current page data
        vm.file = '';
        vm.showWaring = false;
        // go to next page
        vm.showPage(vm.currentPage.pageOrder);
      }
    }

    var counterPromise;
    function showNext() {
      if (vm.counter === 0) { vm.nextEnabled = vm.isEnd; }
      counterPromise = $timeout(countdown, 1500);
    }

    function countdown() {
      if (vm.counter === 0) {
        $timeout.cancel(counterPromise);
        vm.counterDisplay = '';
        vm.nextEnabled = vm.isEnd;
      } else {
        vm.counter--;
        vm.counterDisplay = '(' + vm.counter + ')';
        counterPromise = $timeout(countdown, 1500);
      }
    }

    function watchCheckbox(option) {
      if (option) {
        vm.checkedQueue.push(option);
      } else {
        vm.checkedQueue.pop();
      }
    }

    function returnToList() {
      surveydata.reset();
      $state.go('main');
    }

    function prevPage() {
      vm.showPage(vm.currentPage.pageOrder - 2);
    }

    function showPrev() {
      return (vm.currentPage.pageOrder - 2) < 0;
    }

    //    function generateHeader(scales, type) {
    //      var headers = generateScales(scales);
    //      headers.forEach(function(scale, index){
    //        var content = '';
    //        if (type === 'likert') {
    //          _.forEach(generateScaleOption(scale), function(char){ content += char +'<br>'; });
    //        } else content = index + 1 + '';
    //        headers[index] = { val: scale, name: content };
    //      });
    //      return headers;
    //    }
    //
    //    function generateScaleOption(scale) {
    //      switch(scale) {
    //        case 1:
    //          return '非常不同意';
    //        case 2:
    //          return '不同意';
    //        case 3:
    //          return '有點不同意';
    //        case 4:
    //          return '沒意見';
    //        case 5:
    //          return '有點同意';
    //        case 6:
    //          return '同意';
    //        case 7:
    //          return '非常同意';
    //      }
    //    }
    //
    //    function processLikertScale(item) {
    //      var content = item.content,
    //          scales = item.options.scales,
    //          questions = content.split('\n');
    //      questions.forEach(function(question, index){
    //        questions[index] = {
    //          order: index + 1,
    //          content: question,
    //          selected: '',
    //          options: generateScales(scales)
    //        };
    //      });
    //      return questions;
    //    }
    //
    //    function processSemanticScale(item) {
    //      var content = item.content,
    //          scales = item.options.scales,
    //          questions = content.split('\n');
    //      if (questions[0].search(',') === -1) {
    //        item.title = questions.shift();
    //      }
    //      questions.forEach(function(question, index){
    //        questions[index] = {
    //          order: index + 1,
    //          content: question.split(','),
    //          selected: '',
    //          options: generateScales(scales)
    //        };
    //      });
    //      return questions;
    //    }
    //
    //    function generateScales(scales) {
    //      var data = [1,2,3,4,5,6,7];
    //      switch(scales) {
    //        case 7:
    //          return data;
    //        case 6: // 1,2,3,5,6,7
    //          data.splice(3,1);
    //          return data;
    //        case 5: // 2,3,4,5,6
    //          return data.slice(1, -1);
    //        case 4: // 2,3,5,6
    //          data = data.slice(1, -1);
    //          data.splice(2,1);
    //          return data;
    //        case 3: // 3,5,6
    //          return data.slice(2,-2);
    //      }
    //    }

  });
