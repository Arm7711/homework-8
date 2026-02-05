import sequelize from './db.sequelize.mysql.js';
import Authors from './models/Authors.js';
import Books from './models/Books.js';
import Members from './models/Members.js';
import Borrowings from './models/Borrowings.js';

(async () => {
  const list = [
    Authors,
    Books,
    Members,
    Borrowings
  ];

  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    for (const model of list) {
      await model.sync({ alter: true });
      console.log(`Model ${model.name} synced`);
    }

    Books.belongsTo(Authors, { foreignKey: 'authorId' });
    Authors.hasMany(Books, { foreignKey: 'authorId' });
    
    Books.belongsToMany(Members, { 
      through: Borrowings, 
      foreignKey: 'bookId',
      otherKey: 'memberId'
    });
    
    Members.belongsToMany(Books, { 
      through: Borrowings, 
      foreignKey: 'memberId',
      otherKey: 'bookId'
    });
    
    Borrowings.belongsTo(Books, { foreignKey: 'bookId' });
    Borrowings.belongsTo(Members, { foreignKey: 'memberId' });

    const author = await Authors.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      birthYear: 1980
    });

    const book = await Books.create({
      title: 'Node.js Programming',
      isbn: '1234567890123',
      publishedYear: 2023,
      price: 29.99,
      authorId: author.id
    });

    const member = await Members.create({
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@example.com',
      membershipType: 'premium'
    });

    const borrowing = await Borrowings.create({
      bookId: book.id,
      memberId: member.id,
      status: 'borrowed'
    });

    console.log('Test data created:');
    console.log(`Author: ${author.getFullName()}`);
    console.log(`Book: ${book.title}`);
    console.log(`Member active: ${member.isActive()}`);
    console.log(`Borrowing ID: ${borrowing.id}`);

    const foundAuthor = await Authors.findByEmail('john@example.com');
    console.log(`Found author: ${foundAuthor.getFullName()}`);

    const authorBooks = await Books.findByAuthor(author.id);
    console.log(`Author has ${authorBooks.length} books`);

    const premiumMembers = await Members.findByMembershipType('premium');
    console.log(`Premium members: ${premiumMembers.length}`);

    await borrowing.markReturned();
    console.log(`Borrowing marked as returned`);

    for (const model of list) {
      const tableName = model.tableName || model.name.toLowerCase();
      const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`${tableName}: ${results[0].count} records`);
    }

    console.log('Migration completed successfully');
    await sequelize.close();

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
})();