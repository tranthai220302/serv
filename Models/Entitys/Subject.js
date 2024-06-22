import { Sequelize, DataTypes } from "sequelize";

const Subject = (sequelize) => sequelize.define('Subject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prioritize: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    require_spacing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_last_lesson: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },{timestamps: true});


export default Subject;
