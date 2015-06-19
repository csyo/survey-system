(function() {
  'use strict';

  /**
   * Logger Factory
   * @namespace Factories
   */
  angular.module('surveyApp')
    .factory('logger', logger);

  /**
   * @namespace Logger
   * @desc Application wide logger
   * @memberOf Factories
   */
  function logger($log) {
    var service = {
      error: logError,
      info: logInfo,
      waring: logWarning
    };
    return service;

    ////////////

    /**
     * @name logError
     * @desc Logs errors
     * @param {String} msg Message to log
     * @returns {String}
     * @memberOf Factories.Logger
     */
    function logError(msg) {
      $log.error(msg);
      return msg;
    }

    /**
     * @name logInfo
     * @desc Logs informations
     * @param {String} msg Message to log
     * @returns {String}
     * @memberOf Factories.Logger
     */
    function logInfo(msg) {
      $log.info(msg);
      return msg;
    }

    /**
     * @name logWarning
     * @desc Logs warnings
     * @param {String} msg Message to log
     * @returns {String}
     * @memberOf Factories.Logger
     */
    function logWarning(msg) {
      $log.warn(msg);
    }

  }

})();
