// src/components/charts/CategoryChart.jsx

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// C'est une étape de configuration obligatoire pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  // Données de test. Plus tard, elles viendront de votre API.
  const data = {
    labels: ['Électronique', 'Consommables', 'Accessoires', 'Périphériques'],
    datasets: [
      {
        label: '# de Produits',
        data: [45, 60, 30, 15], // Nombre de produits par catégorie
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Bleu
          'rgba(255, 206, 86, 0.8)',  // Jaune
          'rgba(75, 192, 192, 0.8)',  // Vert/Turquoise
          'rgba(153, 102, 255, 0.8)', // Violet
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Répartition des Produits par Catégorie',
        font: {
          size: 16
        }
      },
    },
  };

  return <Doughnut options={options} data={data} />;
};

export default CategoryChart;