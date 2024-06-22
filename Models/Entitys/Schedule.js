import { Sequelize, DataTypes } from "sequelize";

const Schedule = (sequelize) =>  sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number_of_periods: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
    },
  },{timestamps: true});


export default Schedule;
