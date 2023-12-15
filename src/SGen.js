"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSecureID = void 0;
var uppercase = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var lowercase = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var random = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};
function generateSecureID() {
    var id = "".concat(random(uppercase)).concat(random(uppercase)).concat(random(lowercase)).concat(random(numbers)).concat(random(uppercase)).concat(random(lowercase)).concat(random(numbers)).concat(random(uppercase)).concat(random(numbers)).concat(random(uppercase)).concat(random(uppercase)).concat(random(lowercase));
    return id;
}
exports.generateSecureID = generateSecureID;
