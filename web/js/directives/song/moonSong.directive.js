(function() {
    angular.module('directives.moonSong')
        .directive('moonSong', MoonSong);

    function MoonSong() {
        return {
            restrict: 'E',
            templateUrl: 'templates/songDirective.view.html',
            require: '^moonSongList',
            scope: {
                song: '='
            },
            controller: MoonSongController,
            controllerAs: 'vm',
            link: function(scope, element, attrs, songListCtrl) {
                scope.songListCtrl = songListCtrl;
            }
        };
    }

    MoonSongController.$inject = ['$scope', '$log', '$modal', 'Music', 'Songs'];

    function MoonSongController($scope, $log, $modal, Music, Songs) {
        var vm = this;

        vm.play = play;
        vm.addSong = addSong;
        vm.remove = remove;
        vm.update = update;

        function play(song) {
            Music.addSong(song);
            Music.songIndex = Music.songList.length - 1;
            Music.playNow();
        }

        function addSong(song) {
            Music.addSong(song);
        }

        function remove(song) {
            vm.selected = song;

            var modalInstance = $modal.open({
                templateUrl: 'modals/modalDeleteSong.html',
                controller: 'ModalInstanceCtrl'
            });

            modalInstance.result.then(function(song) {
                Songs.remove(vm.selected._id)
                    .then(function() {
                        $scope.songListCtrl.getSongs().splice($scope.songListCtrl.getSongs().indexOf(vm.selected), 1);
                        $log.info('song deleted');
                    })
                    .catch(function() {
                        $log.info('error deleting song');
                    });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        function update(song) {
            var modalInstance = $modal.open({
                templateUrl: 'modals/modalUpdateSong.html',
                controller: 'UpdateModalController',
                controllerAs: 'mvm',
                resolve: {
                    ModalData: function() {
                        return {
                            song: song
                        };
                    }
                }
            });

            modalInstance.result.then(function() {
                Songs.update(song)
                    .then(function() {
                        $log.info('song updated');
                    })
                    .catch(function() {
                        $log.info('error deleting song');
                    });
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }
})();