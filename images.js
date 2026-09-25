const selectedImageNumbers = [
  ...Array.from({ length: 3 }, (_, index) => 4906 + index),
  ...Array.from({ length: 68 }, (_, index) => 4910 + index),
  ...Array.from({ length: 13 }, (_, index) => 5009 + index),
];

const images = selectedImageNumbers.map((imageNumber, index) => {
  const name = `IMG_${imageNumber}.jpg`;

  return {
    name,
    path: `img/Select/${name}`,
    number: index + 1,
  };
});
