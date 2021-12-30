function success(location){
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    const APIKEY = "2f0fe100fc5d6782186df845b2aeb0ef";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;
    fetch(url).then(response => response.json()).then((data) => {
        const FIR = document.querySelector("#weather span:first-child");
        const SEC = document.querySelector("#weather span:nth-child(2)");
        const THR = document.querySelector("#weather span:last-child");
        const city = data.name;
        const weather = data.weather[0].main;
        const temp = data.main.temp;
        FIR.innerText = city;
        SEC.innerText = weather;
        THR.innerText = `${temp}℃`;
    });
}

function error(){
    console.log("I can't find you.");
}

navigator.geolocation.getCurrentPosition(success, error);
