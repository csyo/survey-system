'use strict';

angular.module('surveyApp')
  .controller('PageCtrl', function ($state, $modal, surveydata) {
    var page = this;
    var itemType = this.itemTypes = surveydata.getItemType();
    this.current = surveydata.getCurrentPage();
    this.scaleOptions = [3, 4, 5, 6, 7];

    this.rows = surveydata.getItems();
    this.displayed = [].concat(this.rows);

    /*** Declarsion ***/

    this.add = add;
    this.remove = remove;
    this.format = format;
    this.saveAll = saveAll;
    this.checkRow = checkRow;
    this.editOptionList = editOptionList;
    this.showOptionList = showOptionList;
    this.showInputField = showInputField;
    this.showScale = showScale;
    this.moveItem = moveItem;

    /*** Implementations ***/

    function saveAll() {
      page.rows.forEach(function (row) {
        delete row.tips;
      });
      surveydata.setItems(page.rows);
      // clear tmpPage data
      surveydata.reset();
      // change route
      $state.go('editor');
    }

    function editOptionList(row) {
      var options = $modal.open({
        animation: true,
        templateUrl: 'app/editor/page/options/options.html',
        controller: 'OptionsCtrl',
        controllerAs: 'options',
        resolve: {
          optionList: function () {
            return row.options ? row.options : { list: [{ index: 0 }, { index: 1 }] };
          }
        }
      });

      options.result.then(function (optionList) {
        row.options = optionList;
        row.preview = optionList.typeName === 'radio' ? '(單選題)' :
          optionList.typeName === 'multi' ? '(多選題)' : '(---)';
        optionList.list.forEach(function (option) {
          row.preview += '<li>' + option.name + '</li>';
        });
        row.preview += optionList.otherOption ? '<li>其他</li>' : '';
        console.log(row);
      });
    }

    function checkRow(row) {
      // clean previous data
      row.content = '';
      if (row.options) row.options = null;
      // add default value for scales
      switch (row.itemType.val) {
      case itemType.semantics.val:
      case itemType.semantic.val:
      case itemType.likerts.val:
      case itemType.likert.val:
        row.options = {
          scales: page.scaleOptions[4] // set default scale to 7
        };
        break;
      default:
        break;
      }
    }

    function showInputField(row) {
      switch (row.itemType.val) {
      case itemType.likert.val:
        row.tips = '題目';
        return 'likert.html';
      case itemType.likerts.val:
        row.tips = '題目一\n題目二\n題目三\n題目四\n題目五';
        return 'likert-group.html';
      case itemType.semantic.val:
        row.tips = '題目\n左選項 , 右選項';
        return 'semantic.html';
      case itemType.semantics.val:
        row.tips = '左選項 , 右選項\n左選項 , 右選項';
        return 'semantic-group.html';
      case itemType.choice.val:
      case itemType.blank.val:
        row.tips = '題目';
        return 'question.html';
      default:
        row.tips = '輸入文字';
        return 'text.html';
      }
    }

    function showScale(item) {
      switch (item.val) {
      case itemType.likert.val:
      case itemType.likerts.val:
      case itemType.semantic.val:
      case itemType.semantics.val:
        return true;
      default:
        return false;
      }
    }

    function showOptionList(item) {
      switch (item.val) {
      case itemType.choice.val:
        return true;
      default:
        return false;
      }
    }

    /**
     * Format the content with html line break
     * @param   {Object}  row  Item data
     * @returns {String} formatted content
     */
    function format(content) {
      return (content.match(/\n/g)) ? content.replace(/\n/g, '<br/>') : content;
    }

    function add() {
      page.inserted = {
        itemOrder: surveydata.getItemIndex() + 1,
        itemType: '',
        must: false,
        content: ''
      };
      page.rows.push(page.inserted);
    }

    function remove(index) {
      page.rows.splice(index, 1);
      page.rows.forEach(function (row, index) {
        row.itemOrder = index + 1;
      });
    }

    function moveItem(newIndex, oldIndex, row) {
      if (newIndex <= page.rows.length) {
        page.rows.splice(oldIndex, 1);
        page.rows.splice(newIndex, 0, row);
        page.rows.forEach(function (row, index) {
          row.itemOrder = index + 1;
        });
      }
    }
  });