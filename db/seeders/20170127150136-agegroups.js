const now = new Date();
const ageGroups = [
  {
    name: '18+',
    min: 18,
    created_at: now,
    updated_at: now,
  },
  {
    name: '25+',
    min: 25,
    created_at: now,
    updated_at: now,
  },
  {
    name: '35+',
    min: 35,
    created_at: now,
    updated_at: now,
  },
  {
    name: '45+',
    min: 45,
    created_at: now,
    updated_at: now,
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('AgeGroups', ageGroups, {}),
  down: queryInterface => queryInterface.bulkDelete('AgeGroups', ageGroups, {}),
};
