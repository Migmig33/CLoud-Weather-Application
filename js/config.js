const apiKey = "c3c80c25cd464567895155253250810";

// -- para magbigay ng variable gamit and id -- //
const searchInput = document.getElementById('city-input');
const citySelected = document.getElementById('city-selected');
const temperature = document.getElementById('temperature-selected');
const infoSelected = document.getElementById('info-selected');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');


// -- niggaa potangina -- //
// -- para sa mga forecast gamit ang class --//
const dailyBoxes = document.querySelectorAll('.dailyBox');
const hourBoxes = document.querySelectorAll('.hourBox');


// para ma gfetch and data gamit ang API
async function getWeather(city) {
    try{
        temperature.textContent = "Loading...";
        citySelected.textContent = "Loading...";
        windEl.textContent = "Loading...";
        infoSelected.textContent = "Loading...";
        humidityEl.textContent = "Loading...";
        weatherIcon.textContent = "Loading...";


        const url =`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=no`;
        const response = await fetch(url);
        const data = await response.json();
        
    if (data.error) {
        alert('City Not Found');
        return;

    }

    //-- para sa current weather --//
    citySelected.textContent = data.location.name + ", " + data.location.country;
    temperature.textContent = `${Math.round(data.current.temp_c)}--°C`;
    infoSelected.textContent = data.current.condition.text;
    humidityEl.textContent = `${data.current.humidity}%`;
    windEl.textContent = `${data.current.wind_kph} km/h`;
    weatherIcon.src = "https:" + data.current.condition.icon;

    //-- para sa 3 day forecast --//
    data.forecast.forecastday.forEach((day, i) => {
        if (dailyBoxes[i]) {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString("en-US", {weekday: "short"});
            const temp = `${Math.round(day.day.avgtemp_c)}--°C`;
            const icon = "https:" + data.current.condition.icon;

            dailyBoxes[i].querySelector("p").textContent = dayName;
            dailyBoxes[i].querySelector("img").src = icon;
            const tempElement =
            dailyBoxes[i].querySelector("#temp") ||
            dailyBoxes[i].querySelector("#temp-daily");
            if(tempElement) tempElement.textContent = temp;
        }
    });

    //-- para sa 6 hour forecast --//
    const hours = data.forecast.forecastday[0].hour;
    const currentHour = new Date().getHours();
    const tomHour = data.forecast.forecastday[1]?.hour || [];

    let next6 = hours.slice(currentHour, currentHour + 6).filter(h => h);
    if(next6.length < 6){
        next6 = next6.concat(tomHour.slice(0, 6 - next6.length));
    }

    next6.forEach((hour, i) => {
        if (hour && hourBoxes[i]) {
            const hourTime = new Date(hour.time).getHours();
            const temp = `${Math.round(hour.temp_c)}--°C`;
            const icon = "https:" + hour.condition.icon;

            hourBoxes[i].querySelector("p:nth-child(1)").textContent = `${hourTime}:00`;
            hourBoxes[i].querySelector("p:nth-child(2)").textContent =  temp;
            hourBoxes[i].querySelector("img").src = icon;
        }
    });
   
 
generateSummary(data);

}
catch(error){
    console.error(error);
    alert("Failed to load weather data.  :(");

}
}

searchInput.addEventListener("keypress", function (e) {
    if(e.key === "Enter"){
        const city = searchInput.value.trim();
        if (city) getWeather(city);
    }
});
