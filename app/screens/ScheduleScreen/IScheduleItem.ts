export interface IScheduleItem {
  auditorium: string
  beginLesson: string,
  building: string,
  date: string,
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
