import { Sequelize, DataTypes } from "sequelize";

const Event = (sequelize) => sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date : {
      type: DataTypes.DATE,
    },
    end_date : {
      type: DataTypes.DATE,
    },
    desc: {
      type: DataTypes.TEXT,
    },
  },{timestamps: true});


export default Event;
