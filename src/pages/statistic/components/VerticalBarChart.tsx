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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface VerticalBarChartProps {
  labels: string[]
  dataValues: number[]
  title?: string
  datasetLabel?: string
}

const VerticalBarChart: React.FC<VerticalBarChartProps> = (props) => {
  const {
    labels = ["January", "February", "March", "April", "May"],
    dataValues = [65, 59, 80, 81, 56],
    title = "Monthly Sales Data (Vertical)",
    datasetLabel = "Revenue",
  } = props;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Revenue 2025",
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
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
        text: "Monthly Sales Data (Vertical)",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales",
        },
        beginAtZero: true,
      },
    },
  }

  return <Bar data={data} options={options} />
}

export default VerticalBarChart
