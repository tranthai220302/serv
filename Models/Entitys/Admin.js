import { Sequelize, DataTypes } from "sequelize";
const Admin = (sequelize) => sequelize.define('Admin', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true, 
    } ,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password :{
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    avatar:{
      type: DataTypes.STRING
    }
});

export default Admin;