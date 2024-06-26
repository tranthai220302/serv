import { Sequelize, DataTypes } from "sequelize";

const BestTimeTableItem = (sequelize) => sequelize.define('BestTimeTableItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: DataTypes.JSON, 
      allowNull: false,
    },
    key : {
        type : DataTypes.STRING,
        allowNull: false,
    }
  },{timestamps: true});


export default BestTimeTableItem;
