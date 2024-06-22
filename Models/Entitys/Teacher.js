import { Sequelize, DataTypes } from "sequelize";

const Teacher = (sequelize) => sequelize.define('Teacher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    joining_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    qualification: {
      type: DataTypes.STRING,
    },
    experience: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.TEXT('long')
    },
    has_children: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true // Disable timestamps for createdAt and updatedAt
  });


export default Teacher;
