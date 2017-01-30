const now = new Date();
const seasons = [
  {
    name: 'Summer 2017',
    start: '2017-05-07',
    end: '2017-08-20',
    created_by: 1,
    created_at: now,
    updated_at: now,
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('Seasons', seasons, {}),
  down: queryInterface => queryInterface.bulkDelete('Seasons', seasons, {}),
};
