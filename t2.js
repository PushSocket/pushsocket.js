const ps = require("pushsocket.js");

const socket = new ps.PushSocket(null, null, handleConnect);

function handleConnect() {
  console.log("Connected to PS Global Staging!");
  socket.send("HIII HAII!! OMG HII! <3", "log");
  socket.send("ping", "log");
}