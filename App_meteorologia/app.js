// Estado
let currCity = "Lisboa";
let units = "metric";

// Seletores
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax");
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');

// Pesquisa
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // Prevenir a ação padrão
    e.preventDefault();
    // Alterar cidade atual
    currCity = search.value;
    // Obter previsão do tempo
    getWeather();
    // Limpar o formulário
    search.value = ""
})

// Unidades
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if(units !== "metric"){
        // Alterar para métrico
        units = "metric";
        // Obter previsão do tempo
        getWeather();
    }
})

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if(units !== "imperial"){
        // Alterar para imperial
        units = "imperial";
        // Obter previsão do tempo
        getWeather();
    }
})

function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600; // Converter segundos para horas

    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("pt-PT", options);
}

// Converter código do país para nome
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["pt-PT"], {type: "region"});
    return regionNames.of(country);
}

function getWeather(){
    const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
            weather__forecast.innerHTML = `<p>${data.weather[0].main}</p>`;
            weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
            weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`;
            weather__minmax.innerHTML = `<p>Mín: ${data.main.temp_min.toFixed()}&#176</p><p>Máx: ${data.main.temp_max.toFixed()}&#176</p>`;
            weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
            weather__humidity.innerHTML = `${data.main.humidity}%`;
            weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`; 
            weather__pressure.innerHTML = `${data.main.pressure} hPa`;

            // Atualizar o fundo com base na condição do tempo
            updateBackground(data.weather[0].main);
        });
}

function updateBackground(weatherCondition) {
    const container = document.querySelector('.container');

    // Remover classes de fundo antigas
    container.classList.remove('sunny', 'rainy', 'cloudy', 'clear');

    // Adicionar a classe de fundo apropriada
    if (weatherCondition.toLowerCase().includes('sun')) {
        container.classList.add('sunny');
    } else if (weatherCondition.toLowerCase().includes('rain')) {
        container.classList.add('rainy');
    } else if (weatherCondition.toLowerCase().includes('cloud')) {
        container.classList.add('cloudy');
    }else if(weatherCondition.toLowerCase().includes('clear')) {
        container.classList.add('clear');
    }
    // Adicione mais condições conforme necessário
}

// Chamar a função para obter o tempo quando a página é carregada
document.body.addEventListener('load', getWeather());
