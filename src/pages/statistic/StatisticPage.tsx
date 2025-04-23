import React, { useState, useEffect, ChangeEvent } from "react"
import VerticalBarChart from "./components/VerticalBarChart"
import HorizontalBarChart from "./components/HorizontalBarChart"
import { getMonthToNow, getAllDaysInMonth } from "../../utils/dateFunction"
import statisticApi from "../../features/statistic/statisticApi"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "react-datepicker/dist/react-datepicker.css"
import { toast } from "react-toastify"
import { useAppSelector } from "../../app/hooks"
import { selectStoreFilter } from "../../features/management/managementSlice"
import { se } from "date-fns/locale"

type ReData = {
  storeId: string
  reYear: number | null
  fromReDate: Date | null
  toReDate: Date | null
}

type TopData = {
  storeId: string
  topYear: number
  topMonth: number | null
  topDay: number | null
}

const StatisticPage: React.FC = () => {
  const yearsToNow = [2021, 2022, 2023, 2024, 2025]
  const { selectedStore } = useAppSelector(selectStoreFilter)
  const [monthsToNow, setMonthsToNow] = useState<number[]>([])
  const [topDaysInMonth, setTopDaysInMonth] = useState<number[]>([])
  const [reData, setReData] = useState<ReData>({
    storeId: selectedStore,
    reYear: null,
    fromReDate: null,
    toReDate: null,
  })
  const [reResult, setReResult] = useState<number[]>([])
  const [reLabels, setReLabels] = useState<string[]>([])

  const [topData, setTopData] = useState<TopData>({
    storeId: selectedStore,
    topYear: 2025,
    topMonth: null,
    topDay: null,
  })

  const [topResult, setTopResult] = useState<number[]>([])
  const [topLabels, setTopLabels] = useState<string[]>([])

  useEffect(() => {
    const months = getMonthToNow()
    setMonthsToNow(months)
  }, [])

  const handleSetYear = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value

    setReData((prev: any) => ({
      ...prev,
      reYear: selectedYear,
      fromReDate: null,
      toReDate: null,
    }))
  }

  const handleFromReDate = (date: Date | null) => {
    setReData((prev: any) => ({
      ...prev,
      reYear: null,
      fromReDate: date,
    }))
  }

  const handleToReDate = (date: Date | null) => {
    setReData((prev: any) => ({
      ...prev,
      reYear: null,
      toReDate: date,
    }))
  }

  const handleRevenueStatisticSubmit = async () => {
    if (reData.reYear !== null && reData.reYear !== undefined) {
      const revenues = await statisticApi.getRevenueMonthOfYear(
        reData.storeId,
        reData.reYear,
      )

      let results = []
      let labels = []

      for (const re of revenues) {
        results.push(re.revenue)
        labels.push(String(re.month))
      }

      setReResult(results)
      setReLabels(labels)
      console.log("co chay khong 2", reData.reYear)
    } else {
      console.log("co chay khong")
      if (!reData.fromReDate || !reData.toReDate) {
        toast.error("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.")
        return
      }

      const diffInMs = Math.abs(
        reData.toReDate.getTime() - reData.fromReDate.getTime(),
      )
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

      if (diffInDays > 31) {
        toast.error("Khoảng cách giữa 2 ngày không được vượt quá 31 ngày.")
        setReData((prev: any) => ({
          ...prev,
          reYear: null,
          fromReDate: null,
          toReDate: null,
        }))
        return
      }

      const revenues = await statisticApi.getRevenueDayInRange(
        reData.storeId,
        reData.fromReDate,
        reData.toReDate,
      )

      let results = []
      let labels = []

      for (const re of revenues) {
        results.push(re.revenue)
        labels.push(String(re.day))
      }

      setReResult(results)
      setReLabels(labels)
    }
  }

  const handleSetTopMonth = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = e.target.value

    setTopData((prev: any) => ({
      ...prev,
      topMonth: selectedMonth,
      topDay: null,
    }))

    const days = getAllDaysInMonth(2025, parseInt(selectedMonth, 10))

    setTopDaysInMonth(days)
  }

  const handleSetTopDay = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedDay = e.target.value

    setTopData((prev: any) => ({
      ...prev,
      topDay: selectedDay,
    }))
  }

  const handleTopStatisticSubmit = async () => {
    if (topData.topMonth !== null && topData.topMonth !== undefined) {
      const topD = await statisticApi.getTopTenDrinksByMonth(
        topData.storeId,
        topData.topMonth,
        topData.topYear,
      )

      console.log(topD)
      let results = []
      let labels = []
      for (const d of topD) {
        results.push(d.totalQuantity)
        labels.push(d.drinkName)
      }

      setTopResult(results)
      setTopLabels(labels)
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-900 text-white p-6 hide-scrollbar">
      <div className="mb-12">
        <h2 className="text-3xl font-semibold text-center text-red-400 mb-6">
          Thống kê doanh thu cửa hàng
        </h2>

        <div className="flex gap-4 p-4 justify-center">
          <select
            value={reData.reYear ?? ""}
            onChange={handleSetYear}
            className="border border-gray-700 rounded-xl p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Chọn năm</option>
            {yearsToNow.map((y, idx) => (
              <option key={idx} value={y} className="bg-gray-800 text-white">
                {y}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-4">
            {/* <label className="text-white">Từ ngày:</label> */}
            <DatePicker
              selected={reData.fromReDate}
              onChange={handleFromReDate}
              className="border border-gray-700 rounded-xl p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
              calendarClassName="bg-gray-200 text-white"
              placeholderText="Từ ngày"
            />
            {/* <label className="text-white">Đến ngày:</label> */}
            <DatePicker
              selected={reData.toReDate}
              onChange={handleToReDate}
              className="border border-gray-700 rounded-xl p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
              calendarClassName="bg-gray-200 text-white"
              placeholderText="Đến ngày"
            />
          </div>

          <button
            className="border border-gray-700 rounded-xl p-2 bg-red-400 text-gray-900 hover:bg-red-500 transition"
            onClick={handleRevenueStatisticSubmit}
          >
            Xem Thống Kê
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <VerticalBarChart
            labels={reLabels}
            dataValues={reResult}
            title="Doanh thu theo tháng"
            datasetLabel="Doanh thu 2025"
          />
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700">
        <h2 className="text-3xl font-semibold text-center text-red-400 my-6">
          Thống kê nước bán chạy
        </h2>

        <div className="flex gap-4 p-4 justify-center pt-6">
          <select
            value={topData.topMonth ?? ""}
            onChange={handleSetTopMonth}
            className="border border-gray-700 rounded-xl p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Chọn tháng</option>
            {monthsToNow.map((m, idx) => (
              <option key={idx} value={m} className="bg-gray-800 text-white">
                {m}
              </option>
            ))}
          </select>

          <select
            value={topData.topDay ?? ""}
            onChange={handleSetTopDay}
            className="border border-gray-700 rounded-xl p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="">Chọn ngày</option>
            {topDaysInMonth.map((d, idx) => (
              <option key={idx} value={d} className="bg-gray-800 text-white">
                {d}
              </option>
            ))}
          </select>

          <button
            className="border border-gray-700 rounded-xl p-2 bg-red-400 text-gray-900 hover:bg-red-500 transition"
            onClick={handleTopStatisticSubmit}
          >
            Xem thống kê
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <HorizontalBarChart
            labels={topLabels}
            data={topResult}
            title="Top Đồ Uống Bán Chạy"
            datasetLabel="Số lượng bán ra"
          />
        </div>
      </div>
    </div>
  )
}

export default StatisticPage
