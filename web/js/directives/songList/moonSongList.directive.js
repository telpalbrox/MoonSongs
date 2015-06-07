(function() {
    angular.module('directives.moonSongList')
        .directive('moonSongList', MoonSong);

    function MoonSong() {
        return {
            restrict: 'E',
            templateUrl: 'templates/songListDirective.view.html',
            scope: {
                songs: '='
            },
            controller: MoonSongListController,
            controllerAs: 'vm'
        };
    }

    MoonSongListController.$inject = ['$scope', 'Music'];

    function MoonSongListController($scope, Music) {
        var vm = this;

        vm.random = random;
        vm.getSongs = getSongs;

        function getSongs() {
            return $scope.songs;
        }

        function random() {
            Music.songList = [];
            Music.songList = JSON.parse(JSON.stringify($scope.songs));
            Music.randomizeSongList();
            Music.songIndex = 0;
            Music.playNow();
        }
    }
})();