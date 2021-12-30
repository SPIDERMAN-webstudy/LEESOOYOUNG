const images = [
    "bg1.jpg",
    "bg2.jpg",
    "bg3.png",
    "bg4.jpg",
    "bg5.jpg",
    "bg6.jpg",
    "bg7.jpg",
    "bg8.jpg",
    "bg9.jpg",
    "bg10.jpg",
];
const BG = document.querySelector("body");

const chosenImage = images[Math.floor(Math.random() * images.length)];

BG.style.backgroundImage = `url(${chosenImage})`;