/**@dandreavh */
document.addEventListener('DOMContentLoaded', () => {
    Chart.defaults.font.family = "Montserrat";
    // Total reservation price per month
    const chartEconomyCanva = document.getElementById('chartEconomy');
    axios.get('/datas/economy')
        .then(response => {
            let labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const results = response.data.results;
            let arrayMonths = [];
            let arrayTotals = [];
            for (const result of results) {
                arrayMonths.push(labels[result.month-1]);
                arrayTotals.push(result.total);
            }
            new Chart('chartEconomy', {
            type: 'line',
            data: {
                labels: arrayMonths,
                datasets: [{
                    label: 'Total €',
                    data: arrayTotals,
                    backgroundColor: 'rgb(3, 138, 162)',
                    borderColor: 'rgb(3, 138, 162)', 
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                    beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Ganancias mensuales'
                    }
                }
            }
            });
        })
        .catch(error => {
            console.error(error);
            chartEconomyCanva.textContent = 'Error al obtener los datos';
        }
    );

    // Reservations quantity
    const chartReservationCanva = document.getElementById('chartReservation');
    axios.get('/datas/reservations')
        .then(response => {
            let labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const results = response.data.results;
            let arrayMonths = [];
            let arrayTotals = [];
            for (const result of results) {
                arrayMonths.push(labels[result.month-1]);
                arrayTotals.push(result.total);
            }
            new Chart('chartReservation', {
            type: 'bar',
            data: {
                labels: arrayMonths,
                datasets: [{
                    label: 'Nº',
                    data: arrayTotals,
                    backgroundColor: 'rgb(116, 75, 192)',
                    borderColor: 'rgb(116, 75, 192)', 
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                    beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Cantidad de reservas mensuales'
                    }
                }
            }
            });
        })
        .catch(error => {
            console.error(error);
            chartReservationCanva.textContent = 'Error al obtener los datos';
        }
    );

    // Room type popularity
    const chartRoomTypeCanva = document.getElementById('chartRoomType');
    axios.get('/datas/roomType')
        .then(response => {
            const results = response.data.results;
            let arrayTypes = [];
            let arrayCounts = [];
            for (const result of results) {
                arrayTypes.push(result.type);
                arrayCounts.push(result.count);
            }
            new Chart('chartRoomType', {
            type: 'doughnut',
            data: {
                labels: arrayTypes,
                datasets: [{
                    label: arrayTypes,
                    data: arrayCounts,
                    backgroundColor: [
                        'rgb(3, 138, 162)',
                        'rgb(116, 75, 192)',
                        'rgb(255, 92, 195)',
                        'rgb(10, 196, 151)',
                        'rgb(250, 163, 0)',
                        'rgb(209, 0, 250)',
                        'rgb(75, 192, 192)',
                        'rgb(75, 75, 192)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                    beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tipos de habitaciones'
                    }
                }
            }
            });
        })
        .catch(error => {
            console.error(error);
            chartRoomTypeCanva.textContent = 'Error al obtener los datos';
        }
    );

    // Pet specie popularity
    const chartPetSpecieCanva = document.getElementById('chartPetSpecie');
    axios.get('/datas/petSpecie')
        .then(response => {
            const results = response.data.results;
            let arrayTypes = [];
            let arrayCounts = [];
            for (const result of results) {
                arrayTypes.push(result.type);
                arrayCounts.push(result.count);
            }
            new Chart('chartPetSpecie', {
            type: 'doughnut',
            data: {
                labels: arrayTypes,
                datasets: [{
                    label: arrayTypes,
                    data: arrayCounts,
                    backgroundColor: [
                        'rgb(3, 138, 162)',
                        'rgb(116, 75, 192)',
                        'rgb(255, 92, 195)',
                        'rgb(10, 196, 151)',
                        'rgb(250, 163, 0)',
                        'rgb(209, 0, 250)',
                        'rgb(75, 192, 192)',
                        'rgb(75, 75, 192)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                    beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tipos de mascotas'
                    }
                }
            }
            });
        })
        .catch(error => {
            console.error(error);
            chartPetSpecieCanva.textContent = 'Error al obtener los datos';
        }
    )
});