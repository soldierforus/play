module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    user_id: {
      type: DataTypes.STRING(30),
      validate: {
        is: /^auth0\|[\da-f]{24}$/i,
      },
      unique: true,
    },
    picture: DataTypes.STRING,
    identities: DataTypes.JSONB,
    app_metadata: DataTypes.JSONB,
    user_metadata: DataTypes.JSONB,
  }, {
    classMethods: {
      associate: (models) => {
        User.hasOne(models.Profile, { foreignKey: 'user_id', onDelete: 'cascade' });
      },
    },
    timestamps: true,
    underscored: true,
  });
  return User;
};
