const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    gender: DataTypes.ENUM('male', 'female'),
    phone: DataTypes.STRING,
    birthdate: {
      type: DataTypes.DATEONLY,
      get: function get() {
        return moment.utc(this.getDataValue('birthdate')).format('YYYY-MM-DD');
      },
    },
    addresses: DataTypes.JSONB,
  }, {
    classMethods: {
      associate: () => {
        // associations can be defined here
      },
    },
    timestamps: true,
    underscored: true,
  });
  return Profile;
};
