const now = new Date();
const users = [
  {
    email: 'noreply@chesmsbl.org',
    picture: 'https://chesmsbl.org/img/logo-120.png',
    user_metadata: JSON.stringify({
      automated: true,
    }),
    created_at: now,
    updated_at: now,
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Users', users, {}),
  down: queryInterface => queryInterface.bulkDelete('Users', users, {}),
};
