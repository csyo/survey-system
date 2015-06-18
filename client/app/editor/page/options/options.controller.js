'use strict';

angular.module('surveyApp')
  .controller('OptionsCtrl', function ($modalInstance, scalesGenerator, optionList) {
    var options = this;

    this.add = add;
    this.removeLast = removeLast;
    this.ok = ok;
    this.cancel = cancel;
    var data = this.data = {};

    if (optionList.type.match(/choice/)) {
      data.typeName = optionList.typeName || '';
      data.otherOption = optionList.otherOption || false;
      data.list = optionList.list || [{ index: 0 }, { index: 1 }];
    } else {
      data.scales = optionList.scales;
      if (data.wider) data.wider = optionList.wider;
      data.list = optionList.list || scalesGenerator.getHeader(optionList.scales, optionList.type);
    }

    function add() {
      var newIndex = data.list.length;
      data.list.push({index: newIndex});
    }

    function removeLast() {
      var lastIndex = data.list.length - 1;
      data.list.splice(lastIndex);
    }

    function ok() {
      $modalInstance.close(options.data);
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  });
