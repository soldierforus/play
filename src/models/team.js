module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    team_name: {
      type: DataTypes.STRING,
      unique: true,
    },
    identities: DataTypes.JSONB,
    app_metadata: DataTypes.JSONB,
    user_metadata: DataTypes.JSONB,
  }, {
    classMethods: {
      associate: (models) => {
        Team.belongsTo(models.AgeGroup, { foreignKey: 'agegroup_id' });
        Team.belongsTo(models.Player, { foreignKey: 'captain' });
        Team.belongsToMany(models.Player, { through: 'PlayerTeam' });
      },
    },
    timestamps: true,
    underscored: true,
  });
  return Team;
};
