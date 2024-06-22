import db from "../Entitys/index.js";
import Schedule from "../Entitys/Schedule.js";
import SchoolClass from "../Entitys/SchoolClass.js";
import Api from "../../ultis/Api.js";
import TimeTableService from "./TimeTableService.js";

import { Op, where } from "sequelize";
import Subject from "../Entitys/Subject.js";
import Teacher from "../Entitys/Teacher.js";
import moment from "moment";
import { configDotenv } from "dotenv";

class GeneticAlgorithmService {
  constructor(dateStart) {
    this.clazzes = [];
    this.lessons = [];
    this.results = {};
    this.waitingLessons = {};
    this.bestTimeTable = {};
    this.MAIN_LESON = ["1", "2", "3", "7", "9"];
    this.run = [];
    this.timeTableService = new TimeTableService();
    this.teacher = [];
    this.teacherBusy = [];
    this.dateStart = dateStart;
    this.MUTATION_RATE = 0.001;
  }

  async prepareData() {
    try {
      this.lessons = await db.schedule.findAll({
        where: {
          SchoolClassId: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: db.schoolClass,
          },
          {
            model: db.teacher,
            include: [
              {
                model: db.user,
              },
            ],
          },
          {
            model: db.subject,
          },
        ],
      });
      this.clazzes = await db.schoolClass.findAll();
      this.teacher = await db.teacher.findAll({
        include: [
          {
            model: db.user,
          },
        ],
      });
      console.log(this.dateStart)
      if (this.dateStart != "null") {
        console.log('cc111');
        const validDate = moment(this.dateStart, "DD-MM-YYYY", true).isValid()
          ? moment(this.dateStart, "DD-MM-YYYY").toISOString()
          : this.dateStart;
        this.teacherBusy = await db.reason.findAll({
          where: {
            date: {
              [Op.gte]: validDate,
            },
          },
        });
      }
      // return this.teacherBusy;
      // return this.teacherBusy;
      // let arr = [];
      // data.forEach((item) => {
      //     let reasonWithAdditionalData = { ...item.toJSON()};
      //     arr.push(reasonWithAdditionalData);
      // })
      // this.teacherBusy = arr;
      this.results = {};
      this.waitingLessons = {};

      this.lessons.forEach((lesson) => {
        this.waitingLessons[lesson.code] = lesson;
      });

      for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
        for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
          const lessonKey = `${day}-${order}`;
          if (!this.results[lessonKey]) {
            this.results[lessonKey] = [];
          }
        }
      }
    } catch (error) {
      console.error("An error occurred while preparing data:", error);
      throw error;
    }
  }
  async setStaticLesson() {
    const saluteFlagSubject = await db.schedule.findOne({
      where: { SubjectId: 14 },
      include: [
        {
          model: db.subject,
        },
      ],
    });
    const classMeetingSubject = await db.schedule.findOne({
      where: { SubjectId: 15 },
      include: [
        {
          model: db.subject,
        },
      ],
    });
    this.clazzes.forEach((clazz) => {
      if (clazz.isMorning) {
        let newSubject = { ...saluteFlagSubject.get({ plain: true }) };
        newSubject.SchoolClass = clazz;
        let subjectMetting = { ...classMeetingSubject.get({ plain: true }) };
        subjectMetting.SchoolClass = clazz;
        this.results["2-1"].push(newSubject);
        this.results["7-5"].push(subjectMetting);
      } else {
      }
    });
  }
  async setStaticLessonAfternoon() {
    const saluteFlagSubject = await db.schedule.findOne({
      where: { SubjectId: 14 },
      include: [
        {
          model: db.subject,
        },
      ],
    });
    const classMeetingSubject = await db.schedule.findOne({
      where: { SubjectId: 15 },
      include: [
        {
          model: db.subject,
        },
      ],
    });
    this.clazzes.forEach((clazz) => {
      if (!clazz.isMorning) {
        let newSubject = { ...saluteFlagSubject.get({ plain: true }) };
        newSubject.SchoolClass = clazz;
        let subjectMetting = { ...classMeetingSubject.get({ plain: true }) };
        subjectMetting.SchoolClass = clazz;
        this.results["2-1"].push(newSubject);
        this.results["7-5"].push(subjectMetting);
      } else {
      }
    });
  }

  async generateBase() {
    await this.setStaticLesson();
    for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
      for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        if (day !== 5 || order !== 5) {
          if (this.timeTableService.isCCOrSH(day, order)) {
            continue;
          }
          for (const [key, lesson] of Object.entries(this.waitingLessons)) {
            let count = 0;
            this.results[`${day}-${order}`].map((item) => {
              if (item.SchoolClass.name == lesson.SchoolClass.name) {
                count++;
              }
            });
            if (count > 0) {
              continue;
            }
            if (
              (day == 3 &&
                order == 5 &&
                lesson.SchoolClass.name.includes("10")) ||
              (day == 4 &&
                order == 5 &&
                lesson.SchoolClass.name.includes("10")) ||
              (day == 6 && order == 5 && lesson.SchoolClass.name.includes("10"))
            ) {
            } else if (
              lesson.SchoolClass?.isMorning &&
              lesson.Subject.name != "Thể dục" &&
              lesson.Subject.name != "GDQP"
            ) {
              this.results[`${day}-${order}`].push(lesson);
              lesson.number_of_periods -= 1;
              if (lesson.number_of_periods === 0) {
                delete this.waitingLessons[key];
              }
            } else if (
              (!lesson.SchoolClass?.isMorning &&
                lesson.Subject.name == "Thể dục") ||
              (!lesson.SchoolClass?.isMorning && lesson.Subject.name == "GDQP")
            ) {
              this.results[`${day}-${order}`].push(lesson);
              lesson.number_of_periods -= 1;
              if (lesson.number_of_periods === 0) {
                delete this.waitingLessons[key];
              }
            }
          }
        } else {
        }
      }
    }

    if (Object.keys(this.waitingLessons).length === 0) {
      return;
    }
  }
  async generateBaseAfterNoon() {
    await this.setStaticLessonAfternoon();
    for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
      for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        if (day !== 5 || order !== 5) {
          if (this.timeTableService.isCCOrSH(day, order)) {
            continue;
          }
          for (const [key, lesson] of Object.entries(this.waitingLessons)) {
            let count = 0;
            this.results[`${day}-${order}`].map((item) => {
              if (item.SchoolClass.name == lesson.SchoolClass.name) {
                count++;
              }
            });
            if (count > 0) {
              continue;
            }
            if (
              ((day == 3 && order == 5) ||
                (day == 5 && (order == 3 || order == 4 || order == 5))) &&
              lesson.SchoolClass.name.includes("11")
            ) {
              // Không có hành động ở đây
            } else if (
              !lesson.SchoolClass?.isMorning &&
              lesson.Subject.name != "Thể dục" &&
              lesson.Subject.name != "GDQP"
            ) {
              this.results[`${day}-${order}`].push(lesson);
              lesson.number_of_periods -= 1;
              if (lesson.number_of_periods === 0) {
                delete this.waitingLessons[key];
              }
            } else if (
              (lesson.SchoolClass?.isMorning &&
                lesson.Subject.name == "Thể dục") ||
              (lesson.SchoolClass?.isMorning && lesson.Subject.name == "GDQP")
            ) {
              this.results[`${day}-${order}`].push(lesson);
              lesson.number_of_periods -= 1;
              if (lesson.number_of_periods === 0) {
                delete this.waitingLessons[key];
              }
            } else {
            }
          }
        } else {
        }
      }
    }

    if (Object.keys(this.waitingLessons).length === 0) {
      return;
    }
  }
  isTeacherBusy(key, clazz, teacher) {
    let count = 0;
    for (const lesson of this.results[key]) {
      if (!lesson.Teacher?.User) {
      }
      if (
        lesson.SchoolClass.name != clazz &&
        lesson.Teacher.User.name == teacher
      ) {
        count++;
      }
    }
    return count > 0;
  }

  replaceTeacher(dayR, orderR, lessonReplace, teacherReplace, kReplace) {
    for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
      for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        if (this.timeTableService.isCCOrSH(day, order)) {
          continue;
        }
        const key = `${day}-${order}`;
        const keyReplace = `${dayR}-${orderR}`;
        for (const [k, lesson] of this.results[key].entries()) {
          // if(this.timeTableService.checkGDQPTD(lesson, day, this.results)){
          //     continue;
          // }
          if (lesson.SchoolClass.name == lessonReplace.SchoolClass.name) {
            if (
              !this.isTeacherBusy(
                keyReplace,
                lesson.SchoolClass.name,
                lesson.Teacher.User.name
              ) &&
              !this.timeTableService.isTeacherVacation(
                dayR,
                lesson.Teacher,
                this.teacherBusy
              )
            ) {
              if (
                !this.isTeacherBusy(
                  key,
                  lessonReplace.SchoolClass.name,
                  teacherReplace
                ) &&
                !this.timeTableService.isTeacherVacation(
                  day,
                  lessonReplace.Teacher,
                  this.teacherBusy
                )
              ) {
                [this.results[key][k], this.results[keyReplace][kReplace]] = [
                  this.results[keyReplace][kReplace],
                  this.results[key][k],
                ];
                return 1;
              }
            }
          }
        }
      }
    }
    return 0;
  }
  addData() {
    for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
      for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        if (day >= 3) {
          const key = `${day}-${order}`;
          for (const clazz of this.clazzes) {
            let count = 0;
            for (const lesson of this.results[key]) {
              if (lesson.SchoolClass.name == clazz.name) {
                count++;
              }
            }
            if (count == 0 && clazz.isMorning) {
              this.results[key].push({
                SchoolClass: {
                  name: clazz.name,
                },
                Subject: {
                  name: `Check${order + "-" + clazz.name}`,
                },
                Teacher: {
                  User: { name: `Thai ${order + "-" + clazz.name}` },
                },
              });
            }
          }
        }
      }
    }
  }
  addDataMorning() {
    for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
      for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        if (day >= 3) {
          const key = `${day}-${order}`;
          for (const clazz of this.clazzes) {
            let count = 0;
            for (const lesson of this.results[key]) {
              if (lesson.SchoolClass.name == clazz.name) {
                count++;
              }
            }
            if (count == 0 && !clazz.isMorning) {
              this.results[key].push({
                SchoolClass: {
                  name: clazz.name,
                },
                Subject: {
                  name: `Check${order + "-" + clazz.name + "-" + day}`,
                },
                Teacher: {
                  User: {
                    name: `Thai ${order + "-" + clazz.name + "-" + day}`,
                  },
                },
              });
            }
          }
        }
      }
    }
  }
  saveBestResult(data) {
    if (Object.keys(data).length === 0) {
      return null;
    }
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = value;
    }
    return result;
  }

  async evolutionToCorrect() {
    let thehe = 0;
    let hasIssue;
    do {
      thehe += 1;
      hasIssue = false;
      for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
        for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
          if (this.timeTableService.isCCOrSH(day, order)) {
            continue;
          }
          const key = `${day}-${order}`;
          for (const [k, lesson] of this.results[key].entries()) {
            if (lesson.Subject.name.includes("Check")) {
              continue;
            }
            if (
              this.isTeacherBusy(
                key,
                lesson.SchoolClass.name,
                lesson.Teacher.User.name
              ) ||
              this.timeTableService.isTeacherVacation(
                day,
                lesson.Teacher,
                this.teacherBusy
              )
            ) {
              this.results[key][k].isTeacherBusy = true;
              const replace = this.replaceTeacher(
                day,
                order,
                lesson,
                lesson.Teacher.User.name,
                k
              );
              if (replace === 0) {
                console.log("có vấn đê");
                hasIssue = true;
                continue;
              }
            } else this.results[key][k].isTeacherBusy = false;
          }
        }
      }
    } while (hasIssue);

    console.log(`Tiến hoá qua ${thehe} thế hệ!`);
  }

  checkSubjectLessonBeforeReplace(timeTable, day, order, k, lesson) {
    const lessonCheck = timeTable[`${day}-${order}`][k];
    return lessonCheck?.Subject.name === lesson?.Subject.name;
  }

  checkBlockSubject(timeTable, day, order, lesson, k) {
    if (lesson.Subject.require_spacing) {
      return false;
    }
    order = parseInt(order);
    let check1 = false;
    let check2 = false;
    let check3 = false;
    let check4 = false;
    if (order === 3) {
      check1 = this.checkSubjectLessonBeforeReplace(
        timeTable,
        day,
        order + 1,
        k,
        lesson
      );
      check2 = this.checkSubjectLessonBeforeReplace(
        timeTable,
        day,
        order + 2,
        k,
        lesson
      );
      if (check1 && !check2) return true;
    }
    if (order < 3) {
      check1 = this.checkSubjectLessonBeforeReplace(
        timeTable,
        day,
        order + 1,
        k,
        lesson
      );
      check2 = this.checkSubjectLessonBeforeReplace(
        timeTable,
        day,
        order + 2,
        k,
        lesson
      );
    } else {
      check1 = this.checkSubjectLessonBeforeReplace(
        timeTable,
        day,
        order - 1,
        k,
        lesson
      );
      check2 = this.checkSubjectLessonBeforeReplace(
        timeTable,
        day,
        order - 2,
        k,
        lesson
      );
    }
    if (check1 && !check2) return true;
    if (order !== 1 && order !== 5) {
      check3 = this.checkSubjectLessonBeforeReplace(
        timeTable,
        day,
        order + 1,
        k,
        lesson
      );
      check4 = this.checkSubjectLessonBeforeReplace(
        timeTable,
        day,
        order - 1,
        k,
        lesson
      );
    }
    if ((!check3 && check4) || (check3 && !check4)) {
      if (check1 && check2) {
        return false;
      }
      if (order === 3) {
        check1 = this.checkSubjectLessonBeforeReplace(
          timeTable,
          day,
          order + 1,
          k,
          lesson
        );
        check2 = this.checkSubjectLessonBeforeReplace(
          timeTable,
          day,
          order + 2,
          k,
          lesson
        );
        if (check1 && !check2) return true;
        check3 = this.checkSubjectLessonBeforeReplace(
          timeTable,
          day,
          order + 1,
          k,
          lesson
        );
        check4 = this.checkSubjectLessonBeforeReplace(
          timeTable,
          day,
          order - 1,
          k,
          lesson
        );
        if ((!check3 && check4) || (check3 && !check4)) {
          if (check1 && check2) {
            return false;
          }
        }
        return true;
      }
      return true;
    }
    return false;
  }

  findLessonByKeyAndNameClass(key, clazz, timeTable) {
    return timeTable[key].filter((lesson) => lesson.SchoolClass.name === clazz);
  }
  mutate() {
    for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
      for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        if (this.timeTableService.isCCOrSH(day, order)) {
          continue;
        }
        const lessonKey = `${day}-${order}`;
        let lessons = this.results[lessonKey];
        if (Math.random() < this.MUTATION_RATE) {
          let classIndex = Math.floor(Math.random() * lessons.length);
          let lesson = lessons[classIndex];
          let randomDay =
            Api.FIRST_DAY +
            Math.floor(Math.random() * (Api.LAST_DAY - Api.FIRST_DAY + 1));
          let randomOrder =
            Api.FIRST_ORDER +
            Math.floor(Math.random() * (Api.LAST_ORDER - Api.FIRST_ORDER + 1));
          let randomLessonKey = `${randomDay}-${randomOrder}`;
          let randomLessons = this.results[randomLessonKey];
          if (randomLessons && randomLessons.length > 0) {
            let randomClassIndex = Math.floor(
              Math.random() * randomLessons.length
            );
            let randomLesson = randomLessons[randomClassIndex];
            if (lesson?.SchoolClassId == randomLesson?.SchoolClassId) {
              lessons[classIndex] = randomLesson;
              randomLessons[randomClassIndex] = lesson;
            }
          }
        }
      }
    }
  }
  async fineTuning(from, to, isMorning) {
    let max_score = -999999;
    let j = 1;
    for (let i = from; i <= to; i++) {
      for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
        for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
          if (this.timeTableService.isCCOrSH(day, order)) {
            continue;
          }
          const key = `${day}-${order}`;
          for (let [k, lesson] of this.results[key].entries()) {
            if (this.checkBlockSubject(this.results, day, order, lesson, k)) {
              continue;
            }
            if (lesson.Subject.name.includes("Check")) {
              continue;
            }
            for (const index of this.timeTableService.findAllReplacement(
              this.results,
              day,
              order,
              lesson
            )) {
              let replaceLesson =
                this.timeTableService.findLessonByKeyAndNameClass(
                  index,
                  lesson.SchoolClass.name,
                  this.results
                );

              const k_replace = this.timeTableService.getKeyLessonByClassName(
                index,
                replaceLesson?.SchoolClass.name,
                this.results
              );
              const arr = index.split("-");
              if (!replaceLesson) {
                continue;
              }

              if (lesson.Subject.name === replaceLesson.Subject.name) {
                continue;
              }

              if (
                this.isTeacherBusy(
                  day + "-" + order,
                  replaceLesson.SchoolClass.name,
                  replaceLesson.Teacher.User.name,
                  this.results
                ) ||
                this.isTeacherBusy(
                  index,
                  lesson.SchoolClass.name,
                  lesson.Teacher.User.name,
                  this.results
                )
              ) {
                continue;
              }

              if (
                this.timeTableService.isTeacherVacation(
                  day,
                  replaceLesson.Teacher,
                  this.teacherBusy
                ) ||
                this.timeTableService.isTeacherVacation(
                  arr[0],
                  lesson.Teacher,
                  this.teacherBusy
                )
              ) {
                continue;
              }

              if (
                this.checkBlockSubject(
                  this.results,
                  arr[0],
                  arr[1],
                  replaceLesson,
                  k_replace
                ) &&
                !this.timeTableService.isTeacherVacation(
                  arr[0],
                  replaceLesson.Teacher,
                  this.teacherBusy
                )
              ) {
                continue;
              }

              if (
                (lesson.Subject.is_last_lesson && arr[1] == Api.LAST_ORDER) ||
                (replaceLesson.Subject.is_last_lesson &&
                  order == Api.LAST_ORDER)
              ) {
                continue;
              }

              if (
                this.timeTableService.checkTripLessonSameDay(
                  this.results,
                  this.MAIN_LESON,
                  lesson,
                  arr[0],
                  arr[1]
                ) ||
                this.timeTableService.checkTripLessonSameDay(
                  this.results,
                  this.MAIN_LESON,
                  replaceLesson,
                  day,
                  order
                )
              ) {
                continue;
              }

              // Thực hiện hoán đổi
              [this.results[key][k], this.results[index][k_replace]] = [
                this.results[index][k_replace],
                this.results[key][k],
              ];

              // Kiểm tra sau khi hoán đổi

              let tmp = lesson;
              lesson = replaceLesson;
              replaceLesson = tmp;
              // this.mutate();
              const score = this.fitness();
              if (score > max_score) {
                max_score = score;
                this.bestTimeTable = this.saveBestResult(this.results);
              }
              // console.log(`Lần chạy thứ ${j} | Kết quả : ${score} | Tốt nhất : ${max_score}`);
              this.results = this.saveBestResult(this.bestTimeTable);
              j++;
              this.run.push({
                i,
                score,
                max_score,
              });
            }
          }
        }
      }
    }

    await db.bestTimeTable.create({
      data: this.bestTimeTable,
      isMorning: isMorning,
    });
  }

  fitness() {
    let score = 10000;
    for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
      for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        if (this.timeTableService.isCCOrSH(day, order)) {
          continue;
        }
        const key = `${day}-${order}`;
        for (const lesson of this.results[key]) {
          if (lesson.Subject.name.includes("Check")) {
            continue;
          }
          if (lesson.Subject.prioritize <= 2) {
            let before = false;
            const previousLesson =
              this.timeTableService.findLessonByKeyAndNameClass(
                day + "-" + (order - 1),
                lesson.Subject.name,
                this.results
              );
            if (previousLesson) {
              before =
                previousLesson.Subject.name === lesson.Subject.name
                  ? true
                  : false;
            }
            let after = false;
            const afterLesson =
              this.timeTableService.findLessonByKeyAndNameClass(
                day + "-" + (order + 1),
                lesson.Subject.name,
                this.results
              );
            if (afterLesson) {
              after =
                afterLesson.Subject.name === lesson.Subject.name ? true : false;
            }
            if (before || after) {
              score += 100;
            } else {
              score -= 100;
            }
          }
          if (
            this.isTeacherBusy(
              key,
              lesson.SchoolClass.name,
              lesson.Teacher.User.name
            )
          ) {
            score -= 500;
          }
          if (
            this.timeTableService.isTeacherVacation(
              day,
              lesson.Teacher,
              this.teacherBusy
            )
          ) {
            // console.log(lesson.Teacher.User.name)
            score -= 500;
          }

          if (lesson.Subject.require_spacing) {
            const checkRequireSpacing =
              this.timeTableService.checkRequireSpacing(
                day,
                order,
                lesson,
                this.results
              );
            if (checkRequireSpacing) {
              score -= 200;
            } else {
              score += 200;
            }
          }
          if (this.timeTableService.checkGDQPTD(lesson, day, this.results)) {
            score += 500;
          } else score -= 100;

          if (lesson.Teacher.has_children) {
            if (order == Api.FIRST_ORDER) {
              score -= 20;
            } else {
              score += 20;
            }
          }
          if (
            this.timeTableService.checkTripLessonSameDay(
              this.results,
              this.MAIN_LESON,
              lesson,
              day,
              order
            )
          ) {
            score -= 200;
          }
        }
      }
    }
    return score;
  }

  getTimeTableByTeacher() {}
}

export default GeneticAlgorithmService;
