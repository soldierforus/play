module.exports = (sequelize, DataTypes) => {
  const AgeGroup = sequelize.define('AgeGroup', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    min: DataTypes.INTEGER,
    max: DataTypes.INTEGER,
  }, {
    timestamps: true,
    underscored: true,
    paranoid: true,
  });
  return AgeGroup;
};
