import { Sequelize, DataTypes } from "sequelize";

const New = (sequelize) => sequelize.define('News', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
    },
    img : {
      type: DataTypes.TEXT,
    }
  }, {
    tableName: 'news'
  },{timestamps: true});


export default New;
