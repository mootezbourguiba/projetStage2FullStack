// src/components/charts/MonthlyActivityChart.jsx

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

const MonthlyActivityChart = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activité Mensuelle du Stock (Entrées/Sorties)',
        font: {
          size: 16
        }
      },
    },
  };

  const labels = ['Août', 'Septembre', 'Octobre'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Entrées',
        data: [120, 150, 180], // Nombre total d'articles entrés chaque mois
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: 'Sorties',
        data: [90, 110, 160], // Nombre total d'articles sortis chaque mois
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default MonthlyActivityChart;