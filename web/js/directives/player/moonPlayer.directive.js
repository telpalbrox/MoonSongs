/**
 * Created by alberto on 11/04/15.
 */
(function() {
  angular.module('directives.moonPlayer')
    .directive('moonPlayer', MoonPlayerDirective);

  MoonPlayerDirective.$inject = ['$interval', 'Music'];

  function MoonPlayerDirective($interval, Music) {

    function link(scope, element, attr, ctrl) {
      var vm = ctrl;
      var timeoutId;

      vm.time = 0;
      vm.pulsado = false;

      activate();

      function activate() {
        createIntervalTime();
        createRangeControl();
        onDestroyElement();
      }

      function createIntervalTime() {
        timeoutId = $interval(updateRangeTime, 1000);
      }

      function updateRangeTime() {
        try {
          vm.duration = Music.getDuration();
        } catch (e) {}
        Music.getTime(function(time) {
          if (!vm.pulsado && time) vm.time = time;
        });
      }

      function createRangeControl() {
        $('#rangeTime')
          .mousedown(mouseDownTime)
          .mouseup(mouseUpTime)
          .change(changeTime);
      }

      function mouseDownTime(event) {
        if (Music.getSong() === undefined) event.preventDefault();
        vm.pulsado = true;
      }

      function mouseUpTime() {
        vm.pulsado = false;
      }

      function changeTime(event) {
        if (Music.getSong() === undefined) return event.preventDefault();
        var elem = $(this).get(0);
        vm.time = elem.value;
        Music.setTime(vm.time);
      }

      function onDestroyElement() {
        element.on('$destroy', function() {
          $interval.cancel(timeoutId);
        });
      }
    }

    return {
      restrict: 'EA',
      templateUrl: 'templates/playerDirective.view.html',
      controller: 'IndexController',
      controllerAs: 'vm',
      scope: {},
      link: link,
      bindToController: true
    };
  }
})();