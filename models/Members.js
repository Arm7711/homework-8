import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.sequelize.mysql.js';

class Members extends Model {  
  isActive() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return this.joinedDate > oneYearAgo;
  }
  
  static findByMembershipType(type) {
    return Members.findAll({ where: { membershipType: type } });
  }
}

Members.init({
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
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phoneNumber: {
    type: DataTypes.STRING
  },
  membershipType: {
    type: DataTypes.STRING,
    defaultValue: 'standard'
  },
  joinedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Members',
  tableName: 'members',
  timestamps: true
});

export default Members;