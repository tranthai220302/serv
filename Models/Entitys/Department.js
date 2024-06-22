import { Sequelize, DataTypes } from "sequelize";

const Departement = (sequelize) => sequelize.define('Departement', {
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
    }
  },{timestamps: true});


export default Departement;
