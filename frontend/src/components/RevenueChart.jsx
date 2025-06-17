import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function RevenueChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/reports/monthly-revenue`)
      .then(res => res.json())
      .then(data => {
        const labels = data.map(r => r.month);
        const totals = data.map(r => parseFloat(r.total_revenue));
        setChartData({
          labels,
          datasets: [
            {
              label: 'Aylık Ciro (₺)',
              data: totals,
              backgroundColor: 'rgba(99, 102, 241, 0.5)',
            },
          ],
        });
      });
  }, []);

  if (!chartData) return <p>Yükleniyor...</p>;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Aylık Fatura Cirosu' },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default RevenueChart;
