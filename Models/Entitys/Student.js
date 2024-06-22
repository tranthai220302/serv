import { Sequelize, DataTypes } from "sequelize";

const Student = (sequelize) => sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.JSON, // JSON type for storing object
    },
    phone: {
      type: DataTypes.STRING,
    },
    family: {
      type: DataTypes.JSON, // JSON type for storing object
    },
  },{timestamps: true});


export default Student;
