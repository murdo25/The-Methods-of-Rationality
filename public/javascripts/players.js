angular.module('players', [])
    .controller('MainCtrl', [
        '$scope', '$http',

        function($scope, $http) {

            $scope.players = [];
            var current_user;
            // var canvas = document.getElementById("gameCanvas");
            // var ctx = canvas.getContext("2d");

            // Create the canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = 812;
            canvas.height = 480;
            document.body.appendChild(canvas);

            var score = 0;

            var hero = {
                speed: 256, // movement in pixels per second
                x: 0,
                y: 0
            };

            var monster = {
                x: 0,
                y: 0
            };

            // Background image
            var bgReady = false;
            var bgImage = new Image();
            bgImage.onload = function() {
                bgReady = true;
            };
            bgImage.src = "images/white_square.bmp";

            // Hero image
            var heroReady = false;
            var heroImage = new Image();
            heroImage.onload = function() {
                heroReady = true;
            };
            heroImage.src = "images/west_idle_animation_by_hero_in_pixels.gif";



            // Monster image
            var monsterReady = false;
            var monsterImage = new Image();
            monsterImage.onload = function() {
                monsterReady = true;
            };
            monsterImage.src = "images/strawberrySmoothie.jpg";


            // Handle keyboard controls
            var keysDown = {};

            addEventListener("keydown", function(e) {
                keysDown[e.keyCode] = true;
            }, false);

            addEventListener("keyup", function(e) {
                delete keysDown[e.keyCode];
            }, false);



            // Reset the game when the player catches a monster
            var reset = function() {
                hero.x = canvas.width / 2;
                hero.y = canvas.height / 2;

                // Throw the monster somewhere on the screen randomly
                monster.x = 32 + (Math.random() * (canvas.width - 64));
                monster.y = 32 + (Math.random() * (canvas.height - 64));
            };

            // Update game objects
            var update = function(modifier) {
                if (38 in keysDown) { // Player holding up
                    hero.y -= hero.speed * modifier;
                }
                if (40 in keysDown) { // Player holding down
                    hero.y += hero.speed * modifier;
                }
                if (37 in keysDown) { // Player holding left
                    hero.x -= hero.speed * modifier;
                }
                if (39 in keysDown) { // Player holding right
                    hero.x += hero.speed * modifier;
                }

                // Are they touching?
                if (
                    hero.x <= (monster.x + 32) &&
                    monster.x <= (hero.x + 32) &&
                    hero.y <= (monster.y + 32) &&
                    monster.y <= (hero.y + 32)
                ) {
                    ++score;
                    reset();
                }
            };

            // Draw everything
            var render = function() {
                // if (bgReady) {
                //     ctx.drawImage(bgImage, 10, 10);
                // }

                if (heroReady) {
                    ctx.drawImage(heroImage, hero.x, hero.y);
                }

                if (monsterReady) {
                    ctx.drawImage(monsterImage, monster.x, monster.y);
                }

                // Score
                ctx.fillStyle = "rgb(250, 250, 250)";
                ctx.font = "24px Helvetica";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.fillText("Monsterrs caught: " + score.toString(), 32, 32);
            };


            // The main game loop
            var main = function() {
                var now = Date.now();
                var delta = now - then;

                update(delta / 1000);
                render();

                then = now;

                // Request to do this again ASAP
                requestAnimationFrame(main);
            };

            // Let's play this game!
            var then = Date.now();
            reset();
            main();

            // Database calls

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
