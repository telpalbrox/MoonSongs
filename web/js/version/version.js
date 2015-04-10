(function() {
  angular.module('moonSongs.version', [
    'moonSongs.version.interpolate-filter',
    'moonSongs.version.version-directive'
  ])
    .value('version', '0.0.6');
})();
