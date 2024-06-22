import { Sequelize, DataTypes } from "sequelize";

const Position = (sequelize) => sequelize.define('Position', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{timestamps: true});


export default Position;
