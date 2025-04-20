import React from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {
  labels: string[]
  data: number[]
  title?: string
  datasetLabel?: string
}

const HorizontalBarChart: React.FC<Props> = ({
  labels,
  data,
  title = "Biểu đồ",
  datasetLabel = "Dữ liệu",
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Giá trị",
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: "Danh sách",
        },
      },
    },
  }

  return <Bar data={chartData} options={options} />
}

export default HorizontalBarChart
