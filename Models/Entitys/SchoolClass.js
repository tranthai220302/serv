import { Sequelize, DataTypes } from "sequelize";

const SchoolClass = (sequelize) => sequelize.define('SchoolClass', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number_student: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isMorning: {
      type: DataTypes.BOOLEAN,
      default : true
    }
  }, {
    tableName: 'school_classes',
    timestamps: false // Disable timestamps for createdAt and updatedAt
  },{timestamps: true});


export default SchoolClass;
