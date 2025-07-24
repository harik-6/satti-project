import React from 'react';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	Title
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function PieChart({ gold_perc, equity_perc }) {

  React.useEffect(() => {
  }, [gold_perc, equity_perc]);

	const data = {
		labels: [ 'Gold','Equity'],
		datasets: [
			{
				label: 'Allocation %',
				data: [gold_perc, equity_perc],
				backgroundColor: [
					'rgba(237, 237, 13, 0.8)',
					'rgba(2, 108, 178, 0.8)',
				],
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: 'bottom',
				labels: {
					padding: 10,
					usePointStyle: true,
					font: {
						size: 10
					}
				}
			},
			title: {
				text: 'Portfolio Allocation',
				font: {
					size: 16,
				}
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						return `${context.label}: ${context.parsed}%`;
					}
				}
			}
		}
	};

	return (
		<div className="w-full max-w-md mx-auto mt-6 mb-6">
			<div className="h-60">
				<Pie data={data} options={options} />
			</div>
		</div>
	);
} 