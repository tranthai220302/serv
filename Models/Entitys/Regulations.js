import { Sequelize, DataTypes } from "sequelize";

const Regulations = (sequelize) => sequelize.define('Regulations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    number : {
        type : DataTypes.JSON
    }
  });


export default Regulations;
