// List of images to cycle through
const backgrounds = [
  'images/background2.png',
  'images/background3.png',
  'images/background4.png',
  'images/background5.png',
  'images/background6.png',
  'images/background7.png',
  'images/background8.png',
  'download.png',
  // Add more image paths as necessary
];

let currentIndex = 0;

function changeBackgroundImage() {
  // Construct the new background style with gradient overlay
  const newBackgroundStyle = `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url('${backgrounds[currentIndex]}')`;

  // Apply the new background style to the container
  document.querySelector('.container').style.backgroundImage = newBackgroundStyle;

  // Update the index to the next image
  currentIndex = (currentIndex + 1) % backgrounds.length;
}

// Change the background every 30 seconds
setInterval(changeBackgroundImage, 10000);

// Optionally, set the first background image on page load
changeBackgroundImage();
