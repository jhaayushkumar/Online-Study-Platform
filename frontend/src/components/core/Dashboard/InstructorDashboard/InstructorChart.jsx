import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")

  // Function to generate beautiful gradient colors for the chart
  const generateRandomColors = (numColors) => {
    const colorPalettes = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'],
      ['#fa709a', '#fee140', '#30cfd0', '#330867', '#a8edea'],
      ['#ff9a56', '#ff6a88', '#ffeaa7', '#55efc4', '#74b9ff'],
      ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b']
    ]
    
    const selectedPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
    const colors = []
    
    for (let i = 0; i < numColors; i++) {
      colors.push(selectedPalette[i % selectedPalette.length])
    }
    return colors
  }

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#F1F2FF',
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#161D29',
        titleColor: '#F1F2FF',
        bodyColor: '#F1F2FF',
        borderColor: '#2C333F',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            if (currChart === "students") {
              return `${label}: ${value} students (${percentage}%)`;
            } else {
              return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
            }
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-y-6 rounded-xl bg-richblack-800 p-6 border border-richblack-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-richblack-5">Analytics</p>
          <p className="text-sm text-richblack-300 mt-1">Visualize your course performance</p>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`flex-1 rounded-lg p-3 px-4 font-semibold transition-all duration-200 ${
            currChart === "students"
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">👥</span>
            <span>Students</span>
          </div>
        </button>

        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`flex-1 rounded-lg p-3 px-4 font-semibold transition-all duration-200 ${
            currChart === "income"
              ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30"
              : "bg-richblack-700 text-richblack-300 hover:bg-richblack-600"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">💰</span>
            <span>Income</span>
          </div>
        </button>
      </div>

      <div className="relative mx-auto w-full max-w-[350px] h-[350px]">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-richblack-700">
        <div className="text-center">
          <p className="text-sm text-richblack-400">Total {currChart === "students" ? "Students" : "Revenue"}</p>
          <p className="text-2xl font-bold text-richblack-5 mt-1">
            {currChart === "students" 
              ? courses.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)
              : `₹${courses.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0).toLocaleString('en-IN')}`
            }
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-richblack-400">Total Courses</p>
          <p className="text-2xl font-bold text-richblack-5 mt-1">{courses.length}</p>
        </div>
      </div>
    </div>
  )
}
