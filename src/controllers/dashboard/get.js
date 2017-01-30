const Bluebird = require('bluebird');
const Player = require('../../models').Player;
const Profile = require('../../models').Profile;
// const Team = require('../../models').Team;

module.exports = (req, res) => {
  Bluebird.join(
    Profile.findOne({ where: { user_id: req.user.id } }),
    Player.findOne({ where: { user_id: req.user.id } }),
    (profile, player) => {
      res.render('dashboard/index', {
        title: 'Dashboard',
        profile,
        player,
      });
    });
};

/*
Team.findAll({ include: [
  {
    model: Player,
    through: {
      where: {
        player_id:
      }
    }
  }
]});
 */
