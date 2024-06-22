import { Sequelize, DataTypes } from "sequelize";

const TimeSlot = (sequelize) => sequelize.define('TimeSlot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'time_slots',
    timestamps: true
  });


export default TimeSlot;
