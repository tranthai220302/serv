import { Sequelize, DataTypes } from "sequelize";

const Infrastructure = (sequelize) => sequelize.define('Infrastructure', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING, // Assuming the 'desc' field is stored as JSON in the database
    },
  },{timestamps: true});


export default Infrastructure;
