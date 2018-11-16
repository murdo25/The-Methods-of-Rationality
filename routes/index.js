var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var player_db = mongoose.model('players');

router.get('/players', function(req, res, next) {
  player_db.find(function(err, players) {
    if (err) { return next(err); }
    res.json(players);
  });
});

router.post('/players', function(req, res, next) {
  // console.log("player posted", req.body)
  var new_player = new player_db(req.body);
  console.log("posting player", new_player)
  new_player.save(function(err, player_data) {
    if (err) {
      console.log("err in the post message")
      return next(err);
    }
    console.log("player inputted")
    res.json(player_data);
  });
});

router.param('player', function(req, res, next, id) {
  var query = player_db.findById(id);
  query.exec(function(err, player) {
    if (err) { return next(err); }
    if (!player) { return next(new Error("can't find player")); }
    req.player = player;
    return next();
  });
});

router.get('/players/:player', function(req, res) {
  res.json(req.player);
});

router.put('/players/:player/points', function(req, res, next) {
  req.player.points(function(err, player) {
    if (err) { return next(err); }
    res.json(player);
  });
});

router.delete('/players/:player', function(req, res) {
  console.log("in Delete");
  req.player.remove();
  res.sendStatus(200);
});

module.exports = router;
