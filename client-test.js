import * as ps from "../src/client-npm.js";

const socket = new ps.PushSocket({
  space_id: "testingGlobal"
}, null, handleConnect);

function handleConnect() {
  console.log("Connected to PS Global Testing!");
}

socket.observe("main", (signal) => {
  const data = signal.data;

  if (data == "ping") {
    socket.send("pong", "main");
    console.log("Pinged PS Global Testing!");
  }
});