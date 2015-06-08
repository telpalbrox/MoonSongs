(function() {
    angular.module('directives.moonSongList')
        .directive('moonValidate', MoonValidate);

    MoonValidate.$inject = ['$timeout', '$q', 'Users'];

    function MoonValidate($timeout, $q, Users) {
        var timeout = null;

        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                field: '@moonValidate'
            },
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$asyncValidators[scope.field] = function(modelValue) {
                    if (!modelValue || ctrl.$isEmpty(modelValue)) {
                        // consider empty model valid
                        return $q.when();
                    }

                    var def = $q.defer();

                    if (timeout) $timeout.cancel(timeout);
                    timeout = $timeout(function() {
                        Users.check(scope.field, modelValue)
                            .then(function(response) {
                                if(response.data.exists === true) {
                                    def.reject();
                                } else {
                                    def.resolve();
                                }
                            })
                            .catch(function(err) {
                                console.error(err);
                                def.reject();
                            });
                    }, 350);

                    return def.promise;
                };
            }
        };
    }
})();