'use strict';

angular.module('surveyApp')
  .controller('PageCtrl', function ($state, $modal, surveydata, toastr) {
    var page = this;
    var itemType = this.itemTypes = surveydata.getItemType();
    this.current = surveydata.getCurrentPage();
    this.scaleOptions = [3, 4, 5, 6, 7];

    this.customMenu = [['bold', 'italic', 'underline', 'strikethrough'],['font-color', 'hilite-color'],['remove-format']];
    this.showTextEditor = false;
    this.htmlContent = '';

    this.rows = surveydata.getItems();
    this.displayed = [].concat(this.rows);
    this.itemOrder = this.rows.map(function(row){ return row.itemOrder; });

    /*** Declarsion ***/

    this.add = add;
    this.remove = remove;
    this.format = format;
    this.saveAll = saveAll;
    this.goBack = goBack;
    this.checkRow = checkRow;
    this.editOptionList = editOptionList;
    this.showOptionList = showOptionList;
    this.showInputField = showInputField;
    this.showScale = showScale;
    this.clearScales = clearScales;
    this.moveItem = moveItem;
    this.openTextEditor = openTextEditor;
    this.done = done;
    this.close = close;

    /*** Implementations ***/

    function saveAll() {
      page.rows.forEach(function (row) {
        delete row.preview;
        delete row.tips;
      });
      surveydata.setItems(page.rows);
      page.goBack();
    }

    function goBack() {
      // clear tmpPage data
      surveydata.reset();
      // change route
      $state.go('editor');

    }

    function editOptionList(row) {
      var type = row.itemType.val;
      type = type.match(/likert/) ? type.match(/likert/)[0] :
        type.match(/semantic/) ? type.match(/semantic/)[0] : row.itemType.val;
      var options = $modal.open({
        animation: true,
        templateUrl: 'app/editor/page/options/options-'+ type +'.html',
        controller: 'OptionsCtrl',
        controllerAs: 'options',
        resolve: {
          optionList: function () {
            switch (row.itemType.val) {
              /*jshint -W086*/
              case itemType.choice.val:
                row.options = row.options || {};
              case itemType.likert.val:
              case itemType.likerts.val:
              case itemType.semantic.val:
              case itemType.semantics.val:
                row.options.type = row.itemType.val;
                return row.options ? row.options : null;
            }
          }
        }
      });

      options.result.then(function (optionList) {
        row.options = optionList;
      });
    }

    function checkRow(row) {
      // clean previous data
      row.content = '';
      if (row.richText) delete row.richText;
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
        row.tips = '題目\n左選項 , 右選項\n左選項 , 右選項';
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
      case itemType.likert.val:
      case itemType.likerts.val:
      case itemType.semantic.val:
      case itemType.semantics.val:
        return true;
      default:
        return false;
      }
    }

    function clearScales(row) {
      row.options.list = null;
    }

    /**
     * Format the content with html line break
     * @param   {Object}  row  Item data
     * @returns {String} formatted content
     */
    function format(content) {
      return (content.match(/\n/g)) ? content.replace(/\n/g, '<br>') : content;
    }

    function add() {
      page.inserted = {
        itemOrder: page.rows.length + 1,
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

    var editingRow;
    function openTextEditor(row) {
      editingRow = row.itemOrder-1;
      row.lines = format(row.content).split('<br>').length;
      if (checkTextarea(row.itemType.val)) {
        page.htmlContent = format(row.content);
        if (row.options && row.options.list) {
          row.options.list.forEach(function(option) {
            page.htmlContent += '<li>' + option.name + '</li>';
          });
          row.lines += row.options.list.length;
        }
      } else {
        page.htmlContent = row.content;
        if (row.options && row.options.list) { // for choice type
          row.options.list.forEach(function(option) {
            page.htmlContent += '<li>' + option.name + '</li>';
          });
          row.lines += row.options.list.length;
        }
      }
      page.showTextEditor = true;
    }

    function checkTextarea(type) {
      if (type.match(/likerts/)) return true;
      if (type.match(/semantics/)) return true;
      return false;
    }

    function done() {
      var row = page.rows[editingRow];
      var content = page.htmlContent;
      var edited = content.match(/<li>/) ? content.split('<li>').length : content.split('<br>').length;
      if (row.lines !== edited || checkTextarea(row.itemType.val)) { // line should match with special case
        toastr.warning('請刪除多餘的行數或取消編輯', '格式錯誤！');
      } else {
        row.richText = true; // mark as html rich content
        if (row.itemType.val.match(/choice/)) {
          var contents = page.htmlContent.split('<li>');
          row.content = contents.shift();
          row.options.list = row.options.list.map(function(option, index) {
            option.name = contents[index].replace(/<\/li>/, '').replace(/<br>/, '');
            return option;
          });
        } else row.content = page.htmlContent;
        close();
      }
    }

    function close() {
      page.htmlContent = '';
      editingRow = -1;
      page.showTextEditor = false;
    }
  });
