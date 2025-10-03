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
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&current=precipitation`;
                const precipurl= 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=precipitation';
                
                const response = await fetch(url);
                if (!response.ok) {
                    console.log("Error: Could not connect to API");
                    return;
                }


                const precipResponse = await fetch(precipurl);
                const precipJSON = await precipResponse.json();

                const json = await response.json();
                const weather = json.current_weather;

                const precipcurrent = precipJSON.current;
                const precip = precipcurrent.precipitation;

                const ameriPrecip = precip / 25.4;

                const time = weather.time;
                const temperature = weather.temperature;
                const windSpeed = weather.windspeed;

                const americanTemp = Math.floor(((temperature * 1.8)+32)*100)/100;
                const americanMile = Math.floor((windSpeed/1.609) * 100)/100;

                console.log(json);
                console.log(precipJSON);

                
                
                let swimCond = "";
                
                
                function checkSwim(precip, temperature, swimCond){
                    if (precip > 10 || temperature < 25 ){
                        swimCond = " not";
                        return swimCond;
                    }
                    if (precip < 10 || temperature >25){
                        swimCond = " ";
                        return swimCond; 
                    }
                }

                swimCond = checkSwim(precip, temperature, swimCond);

                const myImage = new Image(150, 150);

                

                const weatherInfo = `
                    <b>Weather Info:</b><br>
                    Date: ${time.slice(0,10)}<br>
                    Time: ${time.slice(11,16)}<br>
                    Temperature (C): ${temperature} °C<br>
                    Tempurature (F): ${americanTemp} °F<br>
                    Wind Speed (Kilometers): ${windSpeed} km/h<br>
                    Wind Speed (Miles): ${americanMile} Mph<br>
                    precipitation (mm): ${precip} mm <br>
                    precipitation (inches): ${ameriPrecip} in
                    <br> <br>
                    <h2>right now is${swimCond} <br> a good time to <br> go swimming <br> in  ${location}</h2>
                `
                
                myImage.src = "erjgheruigrtuihgrt.png";


                const weatherPanel = document.getElementById('weatherPanel');
                weatherPanel.innerHTML = weatherInfo;

                if (weather.is_day == 1 && (precip < 10 && temperature > 22)){
                    weatherPanel.appendChild(myImage);
                }
                if (weather.is_day == 0){
                    const Bird = new Image(150,150);
                    Bird.src = "sleepybird.png";
                    weatherPanel.appendChild(Bird);
                }
                if (weather.is_day == 1 && temperature < 22 ){
                    const Bird = new Image(150,150);
                    Bird.src = "frozenbird.png";
                    weatherPanel.appendChild(Bird);
                }
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