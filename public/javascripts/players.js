angular.module('players', [])
    .controller('MainCtrl', [
        '$scope', '$http',

        function($scope, $http) {
            $scope.players = [];
            var current_user;

            $scope.addPlayer = function() {
                current_user = $scope.formContent
                console.log("adding player", current_user)
                var newplayer = { player: current_user, points: 0 };
                $http.post('/players', newplayer).success(function(data) {
                    console.log("player added")
                    $scope.players.push(data);
                });
                $scope.formContent = '';
                $scope.user = "Good luck " + current_user
                //go to game page with the new username as your user name
                // window.location.href = "someOtherFile.html";
            };

            $scope.incrementPoints = function(player) {
                $http.put('/players/' + player._id + '/upvote')
                    .success(function(data) {
                        console.log("upvote worked");
                        players.upvotes += 1;
                    });
            };
            $scope.delete = function(player) {
                $http.delete('/players/' + player._id)
                    .success(function(data) {
                        console.log("delete worked");
                    });
                $scope.getAll();
            };
            $scope.getAll = function() {
                return $http.get('/players').success(function(data) {
                    angular.copy(data, $scope.players);
                });
            };
            $scope.getAll();
        }
    ]);
