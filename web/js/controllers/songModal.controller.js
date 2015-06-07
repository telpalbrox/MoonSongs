(function() {
    angular.module('moonSongs')
        .controller('ModalInstanceCtrl', ModalCtrl);

    ModalCtrl.$inject = ['$modalInstance', '$scope'];

    function ModalCtrl($modalInstance, $scope) {
        $scope.ok = ok;
        $scope.cancel = cancel;

        function ok() {
            $modalInstance.close($scope.selected);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();
