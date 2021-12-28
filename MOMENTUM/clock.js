const clock = document.querySelector("#clock");

function paintTime(){
    const DATE = new Date();
    const HOUR = String(DATE.getHours()).padStart(2, "0");
    const MINUTE = String(DATE.getMinutes()).padStart(2, "0");
    const SECOND = String(DATE.getSeconds()).padStart(2, "0");
    clock.innerText = `${HOUR}:${MINUTE}:${SECOND}`;
}

paintTime();
setInterval(paintTime, 1000);
