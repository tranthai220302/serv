import { Sequelize, DataTypes } from "sequelize";

const Grade = (sequelize) => sequelize.define('Grade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
    },
    vacation : {
        type : DataTypes.JSON
    }
  });


export default Grade;
