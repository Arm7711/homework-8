import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.sequelize.mysql.js';

class Borrowings extends Model {  
  static findActiveBorrowings() {
    return Borrowings.findAll({ where: { status: 'borrowed' } });
  }
  
  markReturned() {
    this.status = 'returned';
    this.returnDate = new Date();
    return this.save();
  }
}

Borrowings.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  borrowDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  returnDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'borrowed',
    validate: {
      isIn: [['borrowed', 'returned']]
    }
  },
  bookId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  memberId: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Borrowings',
  tableName: 'borrowings',
  timestamps: true
});

export default Borrowings;