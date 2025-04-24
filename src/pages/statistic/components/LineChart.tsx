import React from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

interface LineChartProps {
  pastLabels: number[] // Nhãn cho doanh thu đã biết
  futureLabels: number[] // Nhãn cho phần dự đoán
  actualValues: number[] // Doanh thu thực tế
  predictedValues: number[] // Doanh thu dự đoán tương lai
  title?: string
}

const LineChart: React.FC<LineChartProps> = ({
  pastLabels,
  futureLabels,
  actualValues,
  predictedValues,
  title = "Revenue Forecast",
}) => {
  const combinedLabels = [...pastLabels, ...futureLabels]

  const actualDataset = [
    ...actualValues,
    ...Array(futureLabels.length).fill(null), // không vẽ gì ở phần dự đoán
  ]

  const predictedDataset = [
    ...Array(pastLabels.length).fill(null), // không vẽ gì ở phần thực tế
    ...predictedValues,
  ]

  const data = {
    labels: combinedLabels,
    datasets: [
      {
        label: "Actual Revenue",
        data: actualDataset,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.4,
      },
      {
        label: "Predicted Revenue",
        data: predictedDataset,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  }

  const options = {
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
          text: "Time",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue",
        },
      },
    },
  }

  return <Line data={data} options={options} />
}

export default LineChart
