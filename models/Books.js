import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.sequelize.mysql.js';

class Books extends Model {  
  static findByTitle(title) {
    return Books.findOne({ where: { title } });
  }
  
  static findByAuthor(authorId) {
    return Books.findAll({ where: { authorId } });
  }
}

Books.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  isbn: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [13, 13]
    }
  },
  publishedYear: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1000,
      max: new Date().getFullYear()
    }
  },
  genre: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  coverImage: {
    type: DataTypes.STRING,
    defaultValue: 'default-cover.jpg'
  },
  authorId: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Books',
  tableName: 'books',
  timestamps: true
});

export default Books;