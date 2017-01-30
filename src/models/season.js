module.exports = (sequelize, DataTypes) => {
  const Season = sequelize.define('Season', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    start: DataTypes.DATEONLY,
    end: DataTypes.DATEONLY,
  }, {
    classMethods: {
      associate: (models) => {
        Season.belongsTo(models.User, { foreignKey: 'created_by' });
      },
    },
    timestamps: true,
    underscored: true,
    paranoid: true,
  });
  return Season;
};
