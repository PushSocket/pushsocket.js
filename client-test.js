const ps = require("pushsocket.js");

const socket = new ps.PushSocket(null, null, handleConnect);

function handleConnect() {
  console.log("Connected to PS Global Staging!");
}

socket.observe("main", (signal) => {
  const data = signal.data;
  console.log(data);

  if (data == "ping") {
    socket.send("pong", "main");
    console.log("Pinged PS Global Staging!");
  }
});

socket.observe("log", (signal) => {
  const data = signal.data;
  console.log(data);

  socket.send("OK", "diag");
});