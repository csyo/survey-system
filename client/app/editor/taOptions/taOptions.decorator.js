'use strict';

angular.module('surveyApp')
  .config(function ($provide) {
    $provide.decorator('taOptions', function ($delegate, taRegisterTool) {
      /*jshint -W109*/
      // $delegate is the taOptions we are decorating
      $delegate.toolbar = [
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'], ['redo', 'undo', 'clear'],
        ['justifyLeft','justifyCenter','justifyRight','indent','outdent'],
        ['html', 'insertLink']
      ];

      taRegisterTool('backgroundColor', {
        display: "<button colorpicker class='btn btn-default ng-scope' title='Background Color' type='button' colorpicker-close-on-select colorpicker-position='bottom' ng-model='backgroundColor' style='background-color: {{backgroundColor}}'><i class='fa fa-paint-brush'></i></button>",
        action: function (deferred) {
          var self = this;
          this.$editor().wrapSelection('backgroundColor', this.backgroundColor);
          if (typeof self.listener === 'undefined') {
            self.listener = self.$watch('backgroundColor', function (newValue) {
              self.$editor().wrapSelection('backColor', newValue);
            });
          }
          self.$on('colorpicker-selected', function () {
            deferred.resolve();
          });
          self.$on('colorpicker-closed', function () {
            deferred.resolve();
          });
          return;
        }
      });
      $delegate.toolbar[1].push('backgroundColor');

      taRegisterTool('fontColor', {
        display: "<button colorpicker type='button' class='btn btn-default ng-scope' title='Font Color'  colorpicker-close-on-select colorpicker-position='bottom' ng-model='fontColor' style='color: {{fontColor}}'><i class='fa fa-font '></i></button>",
        action: function (deferred) {
          var self = this;
          if (typeof self.listener === 'undefined') {
            self.listener = self.$watch('fontColor', function (newValue) {
              self.$editor().wrapSelection('forecolor', newValue);
            });
          }
          self.$on('colorpicker-selected', function () {
            deferred.resolve();
          });
          self.$on('colorpicker-closed', function () {
            deferred.resolve();
          });
          return false;
        }
      });
      $delegate.toolbar[1].push('fontColor');


      taRegisterTool('colorBlack', {
        iconclass: 'fa fa-square black',
        action: function(){
          this.$editor().wrapSelection('forecolor', 'black');
        }
      });
      $delegate.toolbar[1].push('colorBlack');

      return $delegate;
    });
  });