const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
const numbers = "0123456789".split("");

const random = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Generates a random string of 10 characters; used as the socket ID.
 * Pattern: UUlnUlUNUU (U=uppercase, l=lowercase, n=number)
 */
function generateSecureID() {
  return (
    random(uppercase) +
    random(uppercase) +
    random(lowercase) +
    random(numbers) +
    random(uppercase) +
    random(lowercase) +
    random(numbers) +
    random(uppercase) +
    random(numbers) +
    random(uppercase) +
    random(uppercase) +
    random(lowercase)
  );
}

export { generateSecureID };
