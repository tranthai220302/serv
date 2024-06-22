import configdb from "../../config1/database.js";
import { Sequelize } from "sequelize";
import User from "./User.js";
import TimeSlot from "./TimeSlot.js";
import Teacher from "./Teacher.js";
import Subject from "./Subject.js";
import Student from "./Student.js";
import SchoolClass from "./SchoolClass.js";
import Schedule from "./Schedule.js";
import Position from "./Position.js";
import New from "./New.js";
import Infrastructure from "./Infrastructure.js";
import Image from './Image.js';
import Event from "./Event.js";
import Departement from "./Department.js";
import BestTimeTable from "./BestTimeTable.js";
import Reason from "./Reason.js";
import Grade from "./Grade.js";
import Regulations from "./Regulations.js";
const sequelize = new Sequelize(
    configdb.DB,
    configdb.USER,
    configdb.PASSWORD,
    {
      host: configdb.HOST,
      dialect: configdb.dialect,
      operatorsAliases: 0,
  
      pool: {
        max: configdb.pool.max,
        min: configdb.pool.min,
        acquire: configdb.pool.acquire,
        idle: configdb.pool.idle
      },
      logging: false
    }
);
const db = {}
db.sequelize = sequelize
db.reason = Reason(sequelize);
db.user = User(sequelize);
db.timeSlot = TimeSlot(sequelize);
db.teacher = Teacher(sequelize);
db.subject = Subject(sequelize);
db.student = Student(sequelize);
db.schoolClass = SchoolClass(sequelize);
db.schedule = Schedule(sequelize);
db.position = Position(sequelize);
db.new = New(sequelize);
db.infrastructure = Infrastructure(sequelize);
db.image = Image(sequelize);
db.event = Event(sequelize);
db.departement = Departement(sequelize);
db.bestTimeTable = BestTimeTable(sequelize);
db.grade = Grade(sequelize);
db.regulation = Regulations(sequelize);
//Asscociation
//user vs teacher
db.teacher.belongsTo(db.user);
db.user.hasOne(db.teacher)

db.teacher.hasMany(db.event);
db.event.belongsTo(db.teacher);
//subject vs teacher
db.departement.hasMany(db.subject);
db.subject.belongsTo(db.departement);


//teachder vs department
db.teacher.belongsTo(db.departement);
db.departement.hasMany(db.teacher);
//teacher vs school_class
db.teacher.hasOne(db.schoolClass);
db.schoolClass.belongsTo(db.teacher);
//teacher vs schedule
db.teacher.hasMany(db.schedule);
db.schedule.belongsTo(db.teacher);
//school_class vs schedule
db.schoolClass.hasMany(db.schedule);
db.schedule.belongsTo(db.schoolClass);
//image vs event
db.event.hasMany(db.image);
db.image.belongsTo(db.event)
//image vs new
db.image.hasMany(db.new);
db.new.belongsTo(db.image);
//subject vs schedule
db.schedule.belongsTo(db.subject);
db.subject.hasMany(db.schedule)

//class vs instarfure
db.schoolClass.hasMany(db.infrastructure);
db.infrastructure.belongsTo(db.schoolClass);

db.schoolClass.hasMany(db.student);
db.student.belongsTo(db.schoolClass)

db.teacher.hasMany(db.reason);
db.reason.belongsTo(db.teacher);

db.grade.belongsToMany(db.subject, { through: db.regulation });
db.subject.belongsToMany(db.grade, { through: db.regulation });

db.schoolClass.belongsTo(db.grade);
db.grade.hasMany(db.schoolClass);
export default db;
