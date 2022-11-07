export interface IScheduleItem {
  auditorium: string
  beginLesson: string,
  building: string,
  date: string,
  fullDate: Date,
  dayOfWeekString: string,
  discipline: string,
  disciplineAbbr: string,
  endLesson: string,
  group: null | string,
  kindOfWork: string,
  kindOfWorkId: number,
  lecturer: string,
  isEmpty?: boolean,
}
