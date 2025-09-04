<script>
        document.getElementById('enter').addEventListener('click', async () => {
            const location = document.getElementById('textfield').value.trim();
            if (location.toLowerCase() === "no") {
                window.close();
                return;
            }

            const locData = await getLocationData(location);
            if (!locData) {
                alert("Location not found.");
                return;
            }

            const latitude = locData.latitude;
            const longitude = locData.longitude;

            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
                const response = await fetch(url);
                if (!response.ok) {
                    console.log("Error: Could not connect to API");
                    return;
                }

                const json = await response.json();
                const weather = json.current_weather;

                const time = weather.time;
                const temperature = weather.temperature;
                const windSpeed = weather.windspeed;

                const weatherInfo = `
                    <b>Weather Info:</b><br>
                    Time: ${time}<br>
                    Temperature: ${temperature} °C<br>
                    Wind Speed: ${windSpeed} km/h
                `;

                const weatherPanel = document.getElementById('weatherPanel');
                weatherPanel.innerHTML = weatherInfo;

            } catch (err) {
                console.error(err);
            }
        });

        async function getLocationData(location) {
            const formattedLocation = location.replaceAll(" ", "+");
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${formattedLocation}&count=1&language=en&format=json`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.log("Error: Location API failed");
                    return null;
                }
                const json = await response.json();
                return json.results[0];
            } catch (err) {
                console.error(err);
                return null;
            }
        }
</script>