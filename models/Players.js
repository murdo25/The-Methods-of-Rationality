var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  player: String,
  points: { type: Number, default: 0 },
});

Schema.methods.award_point = function(cb) {
  this.points += 1;
  this.save(cb);
};
mongoose.model('players', Schema);
