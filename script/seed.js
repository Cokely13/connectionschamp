'use strict';
const {
  db,
  models: { User,  Answer},
} = require('../server/db');






async function seed() {
  await db.sync({ force: true }); // Clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const users = await Promise.all([
    User.create({
      username: 'Ryan',
      admin: true,
      email: 'ryan.cokely@gmail.com',
      password: '123',
    }),
    User.create({
      username: 'Matt',
      email: 'mclaise@gmail.com',
      password: '123',
    }),
    User.create({
      username: 'Scott',
      email: 'scottlcokely@gmail.com',
      password: '123',
    }),
    User.create({
      username: 'Jamal',
      email: 'jamalcoston@gmail.com',
      password: '123',
    }),
  ]);

  // Helper functions
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
  };

  const adjustDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  const today = new Date().toISOString().split('T')[0];



  console.log(`seeded ${users.length} users`);
  console.log('seeded successfully');

  return {
    users: {
      ryan: users[0],
      matt: users[1],
      scott: users[2],
      jamal: users[3],
    },
    // You can return questions and answers if needed
  };
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
