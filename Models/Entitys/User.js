import { Sequelize, DataTypes } from "sequelize";

const User = (sequelize) => sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.TEXT('long'),
    },
    phone: {
      type: DataTypes.INTEGER,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
    },
  },{
    timestamps: true
  });

export default User;
