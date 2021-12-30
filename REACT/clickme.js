const CLICK = document.querySelector("#CLICK");
const BUTTON = document.querySelector("#button");

function counter(){
    let COUNT = parseInt(CLICK.innerText);
    console.log(COUNT);
    COUNT++;
    CLICK.innerText = String(COUNT);
}

BUTTON.addEventListener("click", counter);