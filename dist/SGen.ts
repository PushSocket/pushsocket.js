const uppercase = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const lowercase = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let random = (array: Array<any>) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generates a random string of 10 characters; used as the socket ID.
 */
function generateSecureID(): string {
  const id = `${random(uppercase)}${random(uppercase)}${random(lowercase)}${random(numbers)}${random(uppercase)}${random(lowercase)}${random(numbers)}${random(uppercase)}${random(numbers)}${random(uppercase)}${random(uppercase)}${random(lowercase)}`;

  return id;
}

export { generateSecureID };
