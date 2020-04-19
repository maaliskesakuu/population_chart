var currentChart;

async function fetchData() {
	var countryCode = document.getElementById('country').value;
	const indicatorCode = 'SP.POP.0014.FE.IN';
	const baseUrl = '//api.worldbank.org/v2/country/';
	const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json' + '&per_page=60';
	console.log('Fetching data from URL: ' + url);

	var response = await fetch(url);

	try {
		if (response.status !== 200) {
			throw new Error('cannot fetch the data');
		} 

		var fetchedData = await response.json();
		console.log(fetchedData);

		var data = getValues(fetchedData);
		var labels = getLabels(fetchedData);
		var countryName = getCountryName(fetchedData);
		var indicator = getIndicator(fetchedData);
		renderChart(data, labels, countryName);
		document.getElementById('indicatorP').textContent = indicator;
		document.getElementById('countryNameP').textContent = countryName;
	} catch (error) {
		alert('error fetching data from World Bank API; check that the country code is correct');
	}  
}

function getValues(data) {
	var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
	return vals;
}

function getLabels(data) {
	var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
	return labels;
}

function getCountryName(data) {
	var countryName = data[1][0].country.value;
	return countryName;
}

function getIndicator(data) {
	var indicator = data[1][0].indicator.value;
	return indicator;
}

function renderChart(data, labels, countryName) {
	var ctx = document.getElementById('myChart').getContext('2d');

	if (currentChart) {
		// Clear the previous chart if it exists
		currentChart.destroy();
	}

	// Draw new chart
	currentChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				label: 'Population, ' + countryName,
				data: data,
				borderColor: 'rgba(79, 251, 223, 1)',
				backgroundColor: 'rgba(79, 251, 223, 0.4)', 
				borderWidth: '2'
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			},
			animation: {
				duration: 3000
			}
		}
	});
}

async function fetchInformation() {
	var countryCode = document.getElementById('country').value;
	const urlInfo = '//restcountries.eu/rest/v2/alpha/' + countryCode + '?fields=capital;region;flag';
	console.log('Fetching data from: ' + urlInfo);

	var response = await fetch(urlInfo);

	try {
		if (response.status !== 200) {
			throw new Error('cannot fetch the data');
		} 

		var fetchedDataInfo = await response.json();

		console.log(fetchedDataInfo);

		document.getElementById('capital').textContent = fetchedDataInfo.capital;

		document.getElementById('region').textContent = fetchedDataInfo.region;

		document.querySelector('#flag').src = fetchedDataInfo.flag;

	} catch (error) {
		alert('error fetching data from RESTCountries; check that the country code is correct');
	};
}

document
	.getElementById('renderBtn')
	.addEventListener('click', fetchData);

document
	.getElementById('renderBtn')
  	.addEventListener('click', fetchInformation);


