const _ = require('lodash');

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'LF', 'CF', 'RF', 'INF', 'MINF', 'OF', 'UTIL', 'DH'];
const LEVELS = [
  'Recreational',
  'Babe Ruth',
  'Pony',
  'High School',
  'American Legion',
  'College',
];

module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    throws: DataTypes.ENUM('right', 'left'),
    bats: DataTypes.ENUM('right', 'left', 'switch'),
    skill: DataTypes.ENUM('Novice', 'Recreational', 'Competitive'),
    positions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      set: (positions) => {
        this.setDataValue('positions', _.compact(positions));
      },
      validate: {
        len: [1, 13],
        isPosition: (positions) => {
          positions.forEach((position) => {
            if (_.includes(POSITIONS, position)) {
              throw new Error(`${position} is not a valid postion. [${POSITIONS.join(', ')}]`);
            }
          });
        },
      },
    },
    experience: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      set: (levels) => {
        this.setDataValue('experience', _.compact(levels));
      },
      validate: {
        len: [1, 6],
        isLevel: (levels) => {
          levels.forEach((level) => {
            if (_.includes(LEVELS, level)) {
              throw new Error(`${level} is not a valid experience level. [${LEVELS.join(', ')}]`);
            }
          });
        },
      },
    },
    pro: DataTypes.BOOLEAN,
    last_played_date: DataTypes.DATEONLY,
    last_played_location: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        Player.belongsTo(models.User, { foreignKey: 'user_id' });
        Player.belongsToMany(models.Team, { through: 'PlayerTeam' });
      },
    },
    timestamps: true,
    underscored: true,
  });
  return Player;
};
