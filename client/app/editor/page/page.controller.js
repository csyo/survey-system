'use strict';

angular.module('surveyApp')
  .controller('PageCtrl', function ($state, $modal, surveydata) {
  var page = this;
  page.current = surveydata.getCurrentPage();
  page.itemTypes = surveydata.getItemType('arr');
  page.scaleOptions = [3,4,5,6,7].map(function(elem,i){
    return elem = { scaleVal: elem};
  });

  page.tips = '';

  page.rows = surveydata.getItems();
  page.displayed = [].concat(page.rows);

  page.saveAll = function() {
      surveydata.setItems(page.rows);
      // clear tmpPage data
      surveydata.reset();
      // change route
      $state.go('editor');
  };

  page.editOptions = function(row) {
    var options = $modal.open({
      animation: true,
      templateUrl: 'app/editor/page/options/options.html',
      controller: 'OptionsCtrl',
      resolve: {
        options: function () { return row.options ? row.options : [{index: 1}, {index: 2}]; }
      }
    });

    options.result.then(function (optionList){
      row.options = optionList;
      console.log(row);
    });
  };

  var item_types = surveydata.getItemType();

  page.checkRow = function(row) {
      // clean previous data
      page.tips = '';
      row.content = '';
      if (row.options) row.options = undefined;
      // add default value for scales
      switch (row.itemType.val) {
          case item_types['semantic-group'].val:
          case item_types['semantic'].val:
            page.tips = '左右項目之間請以逗號隔開';
          case item_types['likert-group'].val:
          case item_types['likert'].val:
            row.options = page.scaleOptions[4]; // set default scale to 7
            break;
      }
  };

  page.checkGroup = function(row) {
      switch (row.itemType.val) {
          case item_types['likert-group'].val:
          case item_types['semantic-group'].val:
              return 'text-area.html';
          default:
              return 'text-input.html';
      }
  };

  page.checkScale = function(item) {
      switch (item.val) {
          case item_types['likert'].val:
          case item_types['likert-group'].val:
          case item_types['semantic'].val:
          case item_types['semantic-group'].val:
              return true;
          default:
              return false;
      }
  };

  page.checkChoice = function(item) {
    switch (item.val) {
      case item_types['choice'].val:
        return true;
      default:
        return false;
    }
  };

  page.format = function (row, flag) {
    if (row.itemType && row.itemType.val.search(/group/g)) {
      if (flag) row.content = row.content.replace(/\n/g,"<br>");
      else row.content = row.content.replace(/<br>/g, "\n");
    }
    return true;
  };

  page.add = function() {
      page.inserted = {
          itemOrder: surveydata.getItemIndex() + 1,
          itemType: '',
          must: false,
          content: ''
      };
      page.rows.push(page.inserted);
  };

  page.remove = function(index) {
      page.rows.splice(index, 1);
  };
});
