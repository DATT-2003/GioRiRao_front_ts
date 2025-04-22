import {
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  endOfWeek,
  eachDayOfInterval,
  getDate,
  getMonth,
} from "date-fns"

const getMonthToNow = () => {
  // Lấy đến tháng hiện tại, ví dụ đang tháng 8, thì nó chỉ trả về 1 đến 8
  const currentMonth = new Date().getMonth() + 1
  let months = []

  for (let i = 1; i <= currentMonth; i++) {
    months.push(i)
  }

  return months
}

function getAllDaysInMonth(year: number, month: number) {
  const date = new Date(year, month + 1, 0) // last day of the month
  const daysInMonth = date.getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
}

export { getMonthToNow, getAllDaysInMonth }
