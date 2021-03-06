(function() {
    angular.module('moonSongs')
        .controller('LoginController', Login);

    Login.$inject = ['Token', '$location', 'Users', '$log'];

    function Login(Token, $location, Users, $log) {
        var vm = this;

        vm.login = login;
        vm.error = "";

        function login() {
            vm.error = '';
            Users.login(vm.userName, vm.pass)
                .then(function(res) {
                    Token.save(res.data.token);
                    $location.path('/start');
                })
                .catch(function(err) {
                    if(err.status === 400) {
                        vm.error = 'INVALIDUSERPASS';
                    }
                    $log.error('Error when login: ' + err.data);
                });
        }
    }
})();
