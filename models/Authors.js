import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.sequelize.mysql.js';

class Authors extends Model {
  static associate(models) {
    Authors.hasMany(models.Books, { foreignKey: 'authorId' });
  }
  
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  
  static findByEmail(email) {
    return Authors.findOne({ where: { email } });
  }
}

Authors.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  bio: {
    type: DataTypes.TEXT
  },
  birthYear: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1000,
      max: new Date().getFullYear()
    }
  }
}, {
  sequelize,
  modelName: 'Authors',
  tableName: 'authors',
  timestamps: true
});

export default Authors;