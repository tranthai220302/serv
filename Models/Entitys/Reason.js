import { Sequelize, DataTypes } from "sequelize";

const Reason = (sequelize) => sequelize.define('Reason', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason : {
        type : DataTypes.STRING,
        allowNull: false,
    },
    day : {
      type : DataTypes.INTEGER
    },
    isConfirm : {
      type : DataTypes.BOOLEAN,
      default : false
    }
  },{timestamps: true});


export default Reason;
