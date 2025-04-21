/**
 * @param {number} alpha Indicated the transparency of the color
 * @returns {string} A string of the form 'rgba(240, 50, 123, 1.0)' that represents a color
 */
function random_color(alpha=1.0) {
    const r_c = () => Math.round(Math.random() * 255)
    return `rgba(${r_c()}, ${r_c()}, ${r_c()}, ${alpha}`
}

// Set the default font size for the charts
Chart.defaults.font.size = 16;

// Draw the charts for the given section
async function drawCharts(section, id) {
    switch (section) {
        case 'player':
            if (id) {
                await drawChartsPlayer(id);
            }
            break;
        case 'global':
            await drawChartsGlobal();
            break;
        case 'top':
            await drawChartsTop();
            break;
        case 'none':
            // Get the container for the charts and empty it
            const container = document.getElementById('chart-container');
            container.innerHTML = '';
            break;
        default:
            break;
    }
}

// Function to turn time strings into seconds
// This is used to convert the Time strings from sql to seconds
function parseTime(timeString) {
    // Split the string by :
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    // Convert to seconds
    return (hours * 3600) + (minutes * 60) + seconds;
}

// Function to draw charts for the user section
async function drawChartsPlayer(id) {
    // To plot data from an API, we first need to fetch a request, and then process the data.
    try {
        const levels_response = await fetch(`/api/stats/view/${id}`, {
            method: 'GET'
        });

        if(levels_response.ok) {
            console.log('Response is ok. Converting to JSON.')

            let results = await levels_response.json()

            console.log(results)
            console.log('Data converted correctly. Plotting chart.')

            // Get the container for the charts
            const container = document.getElementById('chart-container');
            // Create the charts
            if (container) {
                container.innerHTML = `
                    <canvas id="apiChart1"></canvas>
                    <canvas id="apiChart2"></canvas>
                    <canvas id="apiChart3"></canvas>
                    <canvas id="apiChart4"></canvas>
                    <canvas id="apiChart5"></canvas>
                `;
            }

            // Get the data from the API response
            let bestTime = results['Mejor Tiempo'];
            let deaths = [results['Muertes']];
            let enemiesKilled = [results['Enemigos Derrotados']];
            let outgoingDamage = [results['Daño Infligido']];
            let incomingDamage = [results['Daño Recibido']];
            let completedGames = [results['Victorias']];
            let meleeCont = [results['Ataques Pinza']];
            let gunCont = [results['Ataques Pistola']];

            // Chart 1 - deaths vs completed games

            // Plotting variables
            let level_names = ['Muertes', 'Victorias'];
            let level_colors = level_names.map(() => random_color(0.8));
            let level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            let level_completion = [
                deaths,
                completedGames
            ];

            const ctx_levels1 = document.getElementById('apiChart1').getContext('2d');
            const levelChart1 = new Chart(ctx_levels1, 
                {
                    type: 'bar',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Muertes vs. Victorias',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                data: level_completion
                            }
                        ]
                    }
                }
            );

            // Chart 2 - damage dealt vs damage received

            level_names = ['Daño Infligido', 'Daño recibido'];
            level_colors = level_names.map(() => random_color(0.8));
            level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            level_completion = [
                outgoingDamage,
                incomingDamage
            ];

            const ctx_levels2 = document.getElementById('apiChart2').getContext('2d');
            const levelChart2 = new Chart(ctx_levels2, 
                {
                    type: 'pie',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Daño Infligido vs. Recibido',
                                backgroundColor: level_colors,
                                pointRadius: 10,
                                data: level_completion
                            }
                        ]
                    }
                }
            );

            // Chart 3 - best time vs global average time

            // Get the global stats for comparison
            const global_response = await fetch('/api/stats', {method: 'GET'});
            let global_results = await global_response.json();
            // Get the data from the API response
            let globalAvgTime = global_results['Tiempo Promedio'];

            // Convert time to numbers
            const parsedBestTime = parseTime(bestTime);
            const parsedGlobalAvgTime = parseTime(globalAvgTime);

            // Plotting variables
            level_names = ['Mejor Tiempo', 'Tiempo Global Promedio'];
            level_colors = level_names.map(() => random_color(0.8));
            level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            level_completion = [
                parsedBestTime,
                parsedGlobalAvgTime
            ];
            
            const ctx_levels3 = document.getElementById('apiChart3').getContext('2d');
            const levelChart3 = new Chart(ctx_levels3, 
                {
                    type: 'line',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Mejor Tiempo vs. Tiempo Global [Segundos]',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                borderWidth: 2,
                                pointRadius: 10,
                                pointHoverRadius: 20,
                                data: level_completion
                            }
                        ]
                    }
                }
            );

            // Chart 4 - deaths vs completed games

            level_names = ['Muertes', 'Victorias'];
            level_colors = level_names.map(() => random_color(0.8));
            level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            level_completion = [
                deaths,
                completedGames
            ];

            const ctx_levels4 = document.getElementById('apiChart4').getContext('2d');
            const levelChart4 = new Chart(ctx_levels4, 
                {
                    type: 'doughnut',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Muertes vs. Victorias',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                data: level_completion
                            }
                        ]
                    }
                }
            );

            // Chart 5 - melee vs pistol hits

            level_names = ['Ataques Pinza', 'Ataques Pistola'];
            level_colors = level_names.map(() => random_color(0.8));
            level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            level_completion = [
                meleeCont,
                gunCont
            ];

            const ctx_levels5 = document.getElementById('apiChart5').getContext('2d');
            const levelChart5 = new Chart(ctx_levels5, 
                {
                    type: 'bar',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Ataques Pinza vs. Ataques Pistola',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                data: level_completion
                            }
                        ]
                    }
                }
            );
        }
    } catch(error) {
        console.log(error)
    }
}

// Function to draw charts for the global section
async function drawChartsGlobal() {
    // To plot data from an API, we first need to fetch a request, and then process the data.
    try {
        const levels_response = await fetch('/api/stats', {
            method: 'GET'
        });

        if(levels_response.ok) {
            console.log('Response is ok. Converting to JSON.')

            let results = await levels_response.json()

            console.log(results)
            console.log('Data converted correctly. Plotting chart.')

            // Get the container for the charts
            const container = document.getElementById('chart-container');
            // Create the charts
            if (container) {
                container.innerHTML = `
                    <canvas id="apiChart1"></canvas>
                    <canvas id="apiChart2"></canvas>
                    <canvas id="apiChart3"></canvas>
                    <canvas id="apiChart4"></canvas>
                    <canvas id="apiChart5"></canvas>
                `;
            }

            // Get the data from the API response
            let totalPlayers = results['Jugadores'];
            let registered = [results['Registrados']];
            let invited = [results['Invitados']];
            let avgTime = results['Tiempo Promedio'];
            let enemiesKilled = [results['Enemigos Derrotados']];
            let deaths = [results['Muertes']];
            let incomingDamage = [results['Daño Recibido']];
            let outgoingDamage = [results['Daño Infligido']];
            let completedGames = [results['Partidas Completadas']];
            let meleeCont = [results['Ataques Pinza']];
            let gunCont = [results['Ataques Pistola']];

            // Chart 1 - registered vs invited

            // Plotting variables
            let level_names = ['Registrados', 'Invitados'];
            let level_colors = level_names.map(() => random_color(0.8));
            let level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            let level_completion = [
                registered,
                invited
            ];

            const ctx_levels1 = document.getElementById('apiChart1').getContext('2d');
            const levelChart1 = new Chart(ctx_levels1, 
                {
                    type: 'bar',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Jugadores Registrados vs. Invitados',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                data: level_completion
                            }
                        ]
                    }
                }
            );

            // Chart 2 - incoming vs outgoing damage

            level_names = ['Daño Infligido', 'Daño Recibido'];
            level_colors = level_names.map(() => random_color(0.8));
            level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            level_completion = [
                incomingDamage,
                outgoingDamage
            ];

            const ctx_levels2 = document.getElementById('apiChart2').getContext('2d');
            const levelChart2 = new Chart(ctx_levels2, 
                {
                    type: 'pie',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Daño Infligido vs. Recibido',
                                backgroundColor: level_colors,
                                pointRadius: 10,
                                data: level_completion
                            }
                        ]
                    }
                }
            );

            // Chart 3 - average time vs registered and invited players

            level_names = ['Registrados', 'Invitados'];
            level_colors = level_names.map(() => random_color(0.8));
            level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');

            // Convert time to numbers
            const parsedAvgTime = parseTime(avgTime);
            level_completion = [
                // Divide the average time by the number of players
                // This gives us an estimate of the average time per player
                (parsedAvgTime / totalPlayers) * registered,
                (parsedAvgTime / totalPlayers) * invited
            ];

            const ctx_levels3 = document.getElementById('apiChart3').getContext('2d');
            const levelChart3 = new Chart(ctx_levels3, 
                {
                    type: 'bar',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Tiempo Promedio vs. Jugadores Registrados/Invitados [Segundos]',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                borderWidth: 2,
                                data: level_completion
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Tiempo [Segundos]',
                                },
                            }
                        }
                    }
                }
            );

            // Chart 4 - deaths vs completed games

            level_names = ['Muertes', 'Victorias'];
            level_colors = level_names.map(() => random_color(0.8));
            level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            level_completion = [
                deaths,
                completedGames
            ];
            const ctx_levels4 = document.getElementById('apiChart4').getContext('2d');
            const levelChart4 = new Chart(ctx_levels4, 
                {
                    type: 'doughnut',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Muertes vs. Victorias',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                data: level_completion
                            }
                        ]
                    }
                }
            );

            // Chart 5 - melee vs pistol hits

            level_names = ['Ataques Pinza', 'Ataques Pistola'];
            level_colors = level_names.map(() => random_color(0.8));
            level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            level_completion = [
                meleeCont,
                gunCont
            ];

            const ctx_levels5 = document.getElementById('apiChart5').getContext('2d');
            const levelChart5 = new Chart(ctx_levels5, 
                {
                    type: 'bar',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Ataques Pinza vs. Ataques Pistola',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                data: level_completion
                            }
                        ]
                    }
                }
            );
        }

    } catch(error) {
        console.log(error)
    }
}

// Function to draw charts for the top section
async function drawChartsTop() {
    // To plot data from an API, we first need to fetch a request, and then process the data.
    try {
        const levels_response = await fetch('/api/top', {
            method: 'GET'
        });

        if(levels_response.ok) {
            console.log('Response is ok. Converting to JSON.')

            let results = await levels_response.json()

            console.log(results)
            console.log('Data converted correctly. Plotting chart.')

            // Get the container for the charts
            const container = document.getElementById('chart-container');
            // Create the charts
            if (container) {
                container.innerHTML = `
                    <canvas id="apiChart1"></canvas>
                    <canvas id="apiChart2"></canvas>
                    <canvas id="apiChart3"></canvas>
                `;
            }

            // Get the data from the API response
            let usernames = results.map(e => e['Usuario']);
            let times = results.map(e => e['Tiempo']);

            // Convert time to numbers
            const parsedTimes = [];
            for (let i = 0; i < times.length; i++) {
                parsedTimes.push(parseTime(times[i]));
            }

            // Chart 1 - best times

            // Plotting variables
            let level_names = usernames;
            let level_colors = level_names.map(() => random_color(0.8));
            let level_borders = level_names.map(() => 'rgba(0, 0, 0, 1.0)');
            let level_completion = parsedTimes

            const ctx_levels1 = document.getElementById('apiChart1').getContext('2d');
            const levelChart1 = new Chart(ctx_levels1, 
                {
                    type: 'line',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Mejor Tiempo de Jugadores [Segundos]',
                                backgroundColor: level_colors,
                                borderColor: level_borders,
                                borderWidth: 2,
                                pointRadius: 10,
                                pointHoverRadius: 20,
                                data: level_completion,
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Tiempo [Segundos]',
                                },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Jugadores',
                                },
                            }
                        }
                    }
                }
            );

            // Chart 2 - deaths vs completed games

            // Get the daths and completed games of the top players
            // We have to fetch the data from the API again
            const top_response = await fetch('/api/top/stats', {method: 'GET'});
            let top_results = await top_response.json();

            // Get the data from the API response
            let deaths = top_results.map(e => e['numero_muertes']);
            let enemiesKilled = top_results.map(e => e['numero_enemigos']);
            let outgoingDamage = top_results.map(e => e['dano_infligido']);
            let incomingDamage = top_results.map(e => e['dano_recibido']);
            let completedGames = top_results.map(e => e['partidas_completadas']);

            // Plotting variables
            level_names = usernames;
            level_colors = level_names.map(() => random_color(0.8));

            // Generate random estable colors for the bars
            let level_color_1 = random_color(0.8);
            let level_color_2 = random_color(0.8);

            const ctx_levels2 = document.getElementById('apiChart2').getContext('2d');
            const levelChart2 = new Chart(ctx_levels2, 
                {
                    type: 'bar',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Muertes',
                                backgroundColor: level_color_1,
                                borderColor: level_borders,
                                data: deaths
                            },
                            {
                                label: 'Victorias',
                                backgroundColor: level_color_2,
                                borderColor: level_borders,
                                data: completedGames
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Cantidad',
                                },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Jugadores',
                                },
                            }
                        }
                    }
                }
            );

            // Chart 3 - damage dealt vs damage received per player

            const ctx_levels3 = document.getElementById('apiChart3').getContext('2d');
            const levelChart3 = new Chart(ctx_levels3, 
                {
                    type: 'bar',
                    data: {
                        labels: level_names,
                        datasets: [
                            {
                                label: 'Daño Infligido',
                                backgroundColor: level_color_1,
                                borderColor: level_borders,
                                data: outgoingDamage
                            },
                            {
                                label: 'Daño Recibido',
                                backgroundColor: level_color_2,
                                borderColor: level_borders,
                                data: incomingDamage
                            }
                        ]
                    },
                    options: {
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Cantidad',
                                },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Jugadores',
                                },
                            }
                        }
                    }
                }
            );
        }

    } catch(error) {
        console.log(error)
    }
}