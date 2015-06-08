(function () {
    angular
        .module('moonSongs.directives', [
            'directives.moonPlayer',
            'directives.moonSong',
            'directives.moonSongList',
            'directives.moonValidate'
        ]);
})();