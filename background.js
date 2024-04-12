const backgrounds = [
  'images/background2.png',
  'images/background3.png',
  'images/background4.png',
  'images/background5.png',
  'images/background6.png',
  'images/background7.png',
  'images/background8.png',
  'download.png',
];

let currentIndex = 0;

function changeBackgroundImage() {
  const newBackgroundStyle = `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url('${backgrounds[currentIndex]}')`;
  document.querySelector('.container').style.backgroundImage = newBackgroundStyle;
  currentIndex = (currentIndex + 1) % backgrounds.length;
}
setInterval(changeBackgroundImage, 10000);
changeBackgroundImage();
