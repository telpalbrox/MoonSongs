/**
 * Created by alberto on 10/04/15.
 */
(function() {
  angular
    .module('moonSongs.filters')
    .filter('toMinutes', toMinutes);

  function toMinutes() {
    return function(input) {

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        if (s === '-1') return '00';
        return s;
      }

      if (isNaN(input)) {
        return "00:00";
      }

      input = Math.floor(input);
      var minutos = parseInt(input / 60);
      var segundos = input % 60;
      return pad(minutos, 2) + ':' + pad(segundos, 2);
    };
  }
})();