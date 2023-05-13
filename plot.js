const dropdown = document.getElementById('dropdown');

dropdown.addEventListener('change', function() {
	const selected = dropdown.value;
	
	Plotly.d3.csv(`${selected}.csv`, function(data) {
		const x = [], y = [];
		
		for (let i = 0; i < data.length; i++) {
			x.push(data[i].x);
			y.push(data[i].y);
		}
		
		const trace = {
			x: x,
			y: y,
			type: 'scatter'
		};
		
		const layout = {
			title: selected
		};
		
		Plotly.newPlot('plot', [trace], layout);
	});
});