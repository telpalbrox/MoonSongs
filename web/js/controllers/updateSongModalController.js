(function() {
    angular.module('moonSongs')
        .controller('UpdateModalController', UpdateModal);

    UpdateModal.$inject = ['$modalInstance', 'ModalData'];

    function UpdateModal($modalInstance, ModalData) {
        var mvm = this;
        mvm.ok = ok;
        mvm.cancel = cancel;
        mvm.data = ModalData;

        function ok() {
            $modalInstance.close({
                title: mvm.title,
                album: mvm.album,
                artist: mvm.artist
            });
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();
