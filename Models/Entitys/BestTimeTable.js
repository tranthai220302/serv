import { Sequelize, DataTypes } from "sequelize";

const BestTimeTable = (sequelize) => sequelize.define('BestTimeTable', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: DataTypes.JSON, // hoặc sử dụng DataTypes.TEXT nếu muốn lưu dạng văn bản
      allowNull: false,
    },
    isMorning : {
      type : DataTypes.BOOLEAN,
    }
  },{timestamps: true});


export default BestTimeTable;
