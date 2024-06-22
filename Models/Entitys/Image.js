import { Sequelize, DataTypes } from "sequelize";

const Image = (sequelize) => sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },{timestamps: true});


export default Image;
