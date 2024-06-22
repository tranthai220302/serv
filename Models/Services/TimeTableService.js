import Api from "../../ultis/Api.js";
class TimeTableService {
    constructor() {
        this.listKey = [];
    }

    findLessonByKeyAndNameClass(key, clazz, timeTable) {

        if (timeTable[key]) {
            for (const lesson of timeTable[key]) {
                if (lesson.SchoolClass.name === clazz) {
                    return lesson;
                }
            }
        }
        return null;
    }

    checkRequireSpacing(day, order, lesson, timeTable) {
        let start = 1;
        let end = 6;
        if (day === Api.FIRST_DAY) {
            start = day;
            end = day + 1;
        } else if (day === Api.LAST_DAY) {
            end = day;
            start = day - 1;
        } else {
            end = day + 1;
            start = day - 1;
        }
        for (let repDay = start; repDay <= end; repDay++) {
            for (let repOrder = Api.FIRST_ORDER; repOrder <= Api.LAST_ORDER; repOrder++) {
                if (this.isCCOrSH(repDay, repOrder)) {
                    continue;
                }
                if (day === repDay && repOrder === order) {
                    continue;
                }
                const repLesson = this.findLessonByKeyAndNameClass(`${repDay}-${repOrder}`, lesson.SchoolClass.name, timeTable);
                if (repLesson?.Subject.id === lesson?.Subject.id) {
                    return true;
                }
            }
        }
        return false;
    }

    hasChildren(lesson, order, lesson_replace, order_replace) {
        return (order_replace === Api.FIRST_ORDER && lesson.Teacher.has_children) || (order === Api.FIRST_ORDER && lesson_replace.Teacher.has_children);
    }

    getKeyLessonByClassName(key, clazz, timeTable) {
        for (const [lessonKey, lesson] of Object.entries(timeTable[key])) {
            if (lesson.SchoolClass.name === clazz) {
                return lessonKey;
            }
        }
        return 0;
    }

    isTeacherBusy(key, clazz, teacher, timeTable) {
        let i = 0;
        for (const lesson of timeTable[key]) {
            if (lesson.SchoolClass.name !== clazz && lesson.Teacher.User.name === teacher) {
                i++;
            }
        }
        return i > 0;
    }

    isCCOrSH(day, order) {
        return (day === Api.FIRST_DAY && order === Api.FIRST_ORDER) || (day === Api.LAST_DAY && order === 5);
    }

    checkTripLessonSameDay(timeTable, mainLesson, lesson, day, order) {
        const subName = lesson?.Subject.id;
        let mainSubjName = null;

        for (const l of mainLesson) {
            if (l == subName) {
                mainSubjName = l;
                // console.log(l)
                break;
            }
        }

        if (!mainSubjName) {
            return false;
        }
        let count = 0;
        for (let reporder = Api.FIRST_ORDER; reporder <= Api.LAST_ORDER; reporder++) {
            if (this.isCCOrSH(day, reporder)) {
                continue;
            }
            if (reporder == order) continue;
            const tempLesson = this.findLessonByKeyAndNameClass(`${day}-${reporder}`, lesson.SchoolClass.name, timeTable);
            if (tempLesson?.Subject.id == mainSubjName && lesson?.Subject.id == mainSubjName) {
                count++;
            }
        }
        return count >= 2;
    }

    isIgnoreCases(day, order, day_replace, order_replace, lesson_replace, tempLesson, timeTable) {
        if (day === day_replace && order === order_replace) {
            return true;
        }
        if (lesson_replace?.Subject.name === tempLesson?.Subject.name) {
            return true;
        }
        if ((tempLesson?.Subject.require_spacing && this.checkRequireSpacing(day_replace, order_replace, tempLesson, timeTable))
            || (lesson_replace?.Subject.require_spacing && this.checkRequireSpacing(day, order, lesson_replace, timeTable))) {
            return true;
        }
        if (this.hasChildren(tempLesson, order, lesson_replace, order_replace)) {
            return false;
        }
        return (tempLesson?.Subject.is_last_lesson && order_replace === Api.LAST_ORDER) || (lesson_replace?.Subject.is_last_lesson && order === Api.LAST_ORDER);
    }

    findAllReplacement(timeTable, day_replace, order_replace, lesson_replace) {
        const result = [];
        for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
            for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
                if (this.isCCOrSH(day, order)) {
                    continue;
                }
                const tempLesson = this.findLessonByKeyAndNameClass(`${day}-${order}`, lesson_replace.SchoolClass.name, timeTable);
                if (!tempLesson) {
                    continue;
                }
                if (this.checkGDQPTD(tempLesson, day, timeTable)) {
                    continue;
                }
                if (this.isIgnoreCases(day, order, day_replace, order_replace, lesson_replace, tempLesson, timeTable)) {
                    continue;
                }
                if (!this.isTeacherBusy(`${day_replace}-${order_replace}`, tempLesson.SchoolClass.name, tempLesson.Teacher.User.name, timeTable)
                    && !this.isTeacherBusy(`${day}-${order}`, lesson_replace.SchoolClass.name, lesson_replace.Teacher.User.name, timeTable)) {
                    result.push(`${day}-${order}`);
                }
            }
        }
        return result;
    }

    replaceTeacherBusy(keyReplace, teacherReplace, key, teacher, timeTable) {


    }
    isTeacherVacation(day, teacher, teacherBusy) {
        if (teacherBusy.length <= 0) {
            return false;
        }
    
        for (const item of teacherBusy) {
            if (teacher.id == item.TeacherId && day == item.day) { // Kiểm tra đúng ngày
                return true;
            }
        }
        return false;
    }

    checkIsMorning(lesson, order) {
        if ((lesson.SchoolClass.isMorning && lesson.Subject.name == "Thể dục") || (lesson.SchoolClass.isMorning && lesson.Subject.name == "GDQP")) {
            if (order <= 5) return true;
        } else if (lesson.SchoolClass.isMorning && order > 5) {
            return true;
        } else if ((lesson.SchoolClass.isMorning && lesson.Subject.name == "Thể dục") || (!lesson.SchoolClass.isMorning && lesson.Subject.name == "GDQP")) {
            if (order > 5) return true;
        } else if (!lesson.SchoolClass.isMorning && order <= 5) {
            return true;
        }
        return false;
    }
    checkGDQPTD(lesson, day, timeTable) {
        if (lesson.Subject.name == Api.TD || lesson.Subject.name == Api.GDQP) {
            let count = 0;
            for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
                for (let lessonR of timeTable[`${day}-${order}`]) {
                    if (lesson.SchoolClass.name == lessonR.SchoolClass.name) {
                        if (lessonR.Subject.name == Api.TD || lessonR.Subject.name == Api.GDQP) {
                            count++;
                        }
                    }
                }
            }
            if (count == 4) {
                return true;
            } else return false;
        }
        return false;
    }
    vacation(day, order, lesson, data)
    {
        for(let item of data){
            let vactions = JSON.parse(item.data)
        }
    }
}

export default TimeTableService;
