function generateSecureID() {
  const uppercase = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  const lowercase = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  const numbers = [0,1,2,3,4,5,6,7,8,9];

  Array.prototype.random = () => {
    return this[Math.floor(Math.random() * this.length)];
  }
  
  const id = `${uppercase.random()}${uppercase.random()}${lowercase.random()}${number.random()}${uppercase.random()}${lowercase.random()}${numbers.random()}${uppercase.random()}${numbers.random()}${uppercase.random()}${uppercase.random()}${lowercase.random()}`;

  return id;
}

class PushSocket {
  constructor(config, params, onConnect) {
    this.space = config.space_id || "global";
    this.connectedCallback = onConnect;
    this.spacePassword = config.password || "password";
    this.id = generateSecureID();
    this.connected = false;
    this.ws = new WebSocket("wss://pushserver.cubicdev.repl.co");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: "connect",
        id: this.id,
        space: this.space,
        password: this.spacePassword,
        params: params
      }));
    }

    this.ws.onmessage = (e) => {
      const d = JSON.parse(e.data);

      if (d.type == "error") {
        if (d.error == "invalid_password") {
          throw new Error("PUSH_SOCKET_ERROR: INVALID PASSWORD.");
        } else if (d.error == "invalid_space") {
          throw new Error("PUSH_SOCKET_ERROR: INVALID SPACE.");
        }
      } else if (d.type == "connect_success") {
        this.connected = true;
        this.connectedCallback();
      }
    }
  }

  observe(channel, callback) {
    this.ws.addEventListener("message", (e) => {
      const d = JSON.parse(e.data);
      channel = channel || "GLOBAL";

      if (d.type !== "message") return;
      if (d.channel !== channel) return;

      callback(d);
    });
  }

  send(data, channel) {
    this.ws.send(JSON.stringify({
      type: "message",
      channel: channel || "GLOBAL",
      data: data,
      id: this.id
    }));
  }

  get secureID() {
    return this.id;
  }

  set secureID(id) {
    throw new Error("Cannot set secureID; since it is secure.");
  }
}