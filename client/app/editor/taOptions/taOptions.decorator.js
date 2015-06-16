'use strict';

angular.module('surveyApp')
  .config(function ($provide) {
    $provide.decorator('taOptions', function ($delegate, taRegisterTool) {
      /*jshint -W109*/
      // $delegate is the taOptions we are decorating
      $delegate.toolbar = [
//        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'], [], ['redo', 'undo', 'clear'],
        ['justifyLeft','justifyCenter','justifyRight','indent','outdent'],
        ['html', 'insertLink']
      ];

      taRegisterTool('backgroundColor', {
        display: "<button colorpicker class='btn btn-default ng-scope' title='字體背景色' type='button' colorpicker-close-on-select colorpicker-position='bottom' ng-model='backgroundColor' style='background-color: {{backgroundColor}}'><i class='fa fa-paint-brush'></i></button>",
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
        display: "<button colorpicker type='button' class='btn btn-default ng-scope' title='字體顏色'  colorpicker-close-on-select colorpicker-position='bottom' ng-model='fontColor' style='color: {{fontColor}}'><i class='fa fa-magic '></i></button>",
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
        display: '<button class="btn btn-default ng-scope" title="黑字"><i class="fa fa-square black"></i></button>',
        action: function(){
          this.$editor().wrapSelection('forecolor', 'black');
        }
      });
      $delegate.toolbar[2].push('colorBlack');

      taRegisterTool('fontName', {
      display: "<button class='btn btn-default dropdown' title='字型'>" +
          "<span class='dropdown-toggle'><i class='fa fa-font'></i>\&nbsp;\&nbsp;<i class='fa fa-caret-down'></i></span>" +
          "<ul class='dropdown-menu'><li ng-repeat='o in options'><span class='btn btn-link' style='font-family: {{o.css}}' ng-click='action(o.css)' ng-model='o.css'>{{o.name}}</span></li></ul></button>",
      action: function(font) {
        if (font !== '') {
          this.$editor().wrapSelection('fontName', font);
        }
      },
      options: [
        {name: 'Arial', css: 'Arial, Helvetica, sans-serif'},
        {name: 'Times New Roman', css: "'Times New Roman', serif"},
        {name: 'Comic Sans MS', css: "'comic sans ms', sans-serif"},
        {name: 'Courier New', css: "'courier new', monospace"},
        {name: 'Garamond', css: 'garamond, serif'},
        {name: 'Georgia', css: 'georgia, serif'},
        {name: 'Tahoma', css: 'tahoma, sans-serif'},
        {name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif"},
        {name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif"},
        {name: 'Verdana', css: 'verdana, sans-serif'},
        {name: 'Proxima Nova', css: 'proxima_nova_rgregular'},
        {name: '標楷體', css: 'DFKai-sb, Kaiti TC'},
        {name: '新細明體', css: 'PMingLiU'},
        {name: '微軟正黑體', css: 'Microsoft JhengHei'},
      ]
    });
    $delegate.toolbar[1].push('fontName');

    taRegisterTool('fontSize', {
      display: "<button class='btn btn-default dropdown' title='字體大小'>" +
          "<span class='dropdown-toggle'><i class='fa fa-text-height'></i>\&nbsp;\&nbsp;<i class='fa fa-caret-down'></i></span>" +
          "<ul class='dropdown-menu'><li ng-repeat='o in options'><span class='btn btn-link' style='font-size: {{o.css}}' type='button' ng-click='action(o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</span></li></ul></button>",
      action: function(size) {
        if (size !== '') {
          return this.$editor().wrapSelection('fontSize', size);
        }
      },
      options: [
        {name: 'Extra Small', css: 'xx-small', value: '1'},
        {name: 'Small', css: 'x-small', value: '2'},
        {name: 'Medium', css: 'small', value: '3'},
        {name: 'Large', css: 'medium', value: '4'},
        {name: 'Extra Large', css: 'large', value: '5'},
        {name: 'Huge', css: 'x-large', value: '6'}
      ]
    });
    $delegate.toolbar[1].push('fontSize');

      return $delegate;
    });
  });
