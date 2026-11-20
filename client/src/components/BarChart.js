import React, { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const BarChart = ({ data, options }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); // Limpia el gráfico previo
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar", // Gráfico de barras
      data,
      options: {
        ...options,
        indexAxis: "y", // Para que las barras sean horizontales
        layout: {
          padding: {
            left: 20,
            right: 20,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 50, // Ajusta el tamaño de los pasos en el eje X
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              padding: 20, // Ajusta el espacio entre las barras y las etiquetas en el eje Y
            },
          },
        },
        elements: {
          bar: {
            categoryPercentage: 0.5, // Ajusta el espacio entre las barras
            barPercentage: 1, // Ajusta el grosor de las barras
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.raw}`; // Formato de tooltip
              },
            },
          },
          legend: {
            position: "top", // Ubicación de la leyenda
          },
          datalabels: {
            align: 'end', // Alinea las cifras al final de las barras
            anchor: 'end', // Ancla las cifras al final de las barras
            color: '#000', // Color de las etiquetas
            font: {
              weight: 'bold',
              size: 12, // Ajusta el tamaño de la fuente
            },
            formatter: (value) => {
              return value; // Muestra el valor de la estadística
            },
          },
        },
      },
    });

    return () => {
      chartInstance.current.destroy(); // Limpia al desmontar
    };
  }, [data, options]);

  return <canvas ref={chartRef}></canvas>;
};

export default BarChart;
