// 'use strict';
// const {
//   db,
//   models: { User, Answer },
// } = require('../server/db');

// async function seed() {
//   await db.sync({ force: true }); // Clears db and matches models to tables
//   console.log('db synced!');

//   // Creating Users
//   const users = await Promise.all([
//     User.create({
//       username: 'Ryan',
//       admin: true,
//       email: 'ryan.cokely@gmail.com',
//       password: '123',
//     }),
//     User.create({
//       username: 'Matt',
//       email: 'mclaise@gmail.com',
//       password: '123',
//     }),
//     User.create({
//       username: 'Scott',
//       email: 'scottlcokely@gmail.com',
//       password: '123',
//     }),
//     User.create({
//       username: 'Jamal',
//       email: 'jamalcoston@gmail.com',
//       password: '123',
//     }),
//   ]);

//   // Map users by username in lowercase for easy access
//   const usersObj = {
//     ryan: users[0],
//     matt: users[1],
//     scott: users[2],
//     jamal: users[3],
//   };

//   // Define puzzle numbers
//   const puzzleNumbers = [1, 2, 3, 4, 5];

//   // Define dummy answers for each user
//   const data = {
//     ryan: [
//       { number: 1, correct: true, strikes: 0 },
//       { number: 2, correct: false, strikes: 4 },
//       { number: 3, correct: true, strikes: 1 },
//       { number: 4, correct: true, strikes: 3 },
//       { number: 5, correct: true, strikes: 2 },
//     ],
//     matt: [
//       { number: 1, correct: false, strikes: 4 },
//       { number: 2, correct: false, strikes: 4 },
//       { number: 3, correct: false, strikes: 4 },
//       { number: 4, correct: false, strikes: 4 },
//       { number: 5, correct: true, strikes: 1 },
//     ],
//     scott: [
//       { number: 1, correct: true, strikes: 0 },
//       { number: 2, correct: true, strikes: 2 },
//       { number: 3, correct: false, strikes: 4 },
//       { number: 4, correct: true, strikes: 1 },
//       { number: 5, correct: false, strikes: 4 },
//     ],
//     jamal: [
//       { number: 1, correct: false, strikes: 4 },
//       { number: 2, correct: false, strikes: 4 },
//       { number: 3, correct: true, strikes: 0 },
//       { number: 4, correct: false, strikes: 4 },
//       { number: 5, correct: true, strikes: 3 },
//     ],
//   };

//   // Create Answers
//   const answerPromises = [];
//   for (const username in data) {
//     const user = usersObj[username];
//     const answersData = data[username];
//     for (const answerData of answersData) {
//       answerPromises.push(
//         Answer.create({
//           userId: user.id,
//           number: answerData.number,
//           correct: answerData.correct,
//           strikes: answerData.strikes,
//         })
//       );
//     }
//   }

//   await Promise.all(answerPromises);

//   console.log(`seeded ${users.length} users`);
//   console.log(`seeded ${answerPromises.length} answers`);
//   console.log('seeded successfully');

//   return {
//     users: {
//       ryan: users[0],
//       matt: users[1],
//       scott: users[2],
//       jamal: users[3],
//     },
//     // You can return answers if needed
//   };
// }

// async function runSeed() {
//   console.log('seeding...');
//   try {
//     await seed();
//   } catch (err) {
//     console.error(err);
//     process.exitCode = 1;
//   } finally {
//     console.log('closing db connection');
//     await db.close();
//     console.log('db connection closed');
//   }
// }

// if (module === require.main) {
//   runSeed();
// }

// module.exports = seed;


'use strict';
const {
  db,
  models: { User, Answer },
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

  // Map users by username in lowercase for easy access
  const usersObj = {
    ryan: users[0],
    matt: users[1],
    scott: users[2],
    jamal: users[3],
  };

  // Base puzzle number and date
  const basePuzzleNumber = 521;
  const baseDate = new Date('2024-11-13');

  // Define dummy answers for each user
  const data = {
    ryan: [
      { number: 418, correct: true, strikes: 0 },
      { number: 419, correct: false, strikes: 4 },
      { number: 420, correct: true, strikes: 1 },
      { number: 421, correct: true, strikes: 3 },
      { number: 422, correct: true, strikes: 2 },
    ],
    matt: [
      { number: 418, correct: false, strikes: 4 },
      { number: 419, correct: false, strikes: 4 },
      { number: 420, correct: false, strikes: 4 },
      { number: 421, correct: false, strikes: 4 },
      { number: 422, correct: true, strikes: 1 },
    ],
    scott: [
      { number: 418, correct: true, strikes: 0 },
      { number: 419, correct: true, strikes: 2 },
      { number: 420, correct: false, strikes: 4 },
      { number: 421, correct: true, strikes: 1 },
      { number: 422, correct: false, strikes: 4 },
    ],
    jamal: [
      { number: 418, correct: false, strikes: 4 },
      { number: 419, correct: false, strikes: 4 },
      { number: 420, correct: true, strikes: 0 },
      { number: 421, correct: false, strikes: 4 },
      { number: 422, correct: true, strikes: 3 },
    ],
  };

  // Create Answers
  const answerPromises = [];
  for (const username in data) {
    const user = usersObj[username];
    const answersData = data[username];
    for (const answerData of answersData) {
      // Calculate the date based on the puzzle number
      const daysDifference = answerData.number - basePuzzleNumber;
      const date = new Date(
        baseDate.getTime() + daysDifference * 24 * 60 * 60 * 1000
      );
      const formattedDate = date.toISOString().split('T')[0];

      answerPromises.push(
        Answer.create({
          userId: user.id,
          number: answerData.number,
          correct: answerData.correct,
          strikes: answerData.strikes,
          date: formattedDate,
        })
      );
    }
  }

  await Promise.all(answerPromises);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${answerPromises.length} answers`);
  console.log('seeded successfully');

  return {
    users: {
      ryan: users[0],
      matt: users[1],
      scott: users[2],
      jamal: users[3],
    },
    // You can return answers if needed
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
