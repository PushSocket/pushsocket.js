import { generateSecureID } from "./SGen.js";

class PushSocket {
  constructor(config = {}, params = {}, onConnect = () => {}) {
    this._serverURL = "wss://ps-01.xapktech.xyz";
    this.config = config;
    this.space = config.space_id || "global";
    this.spacePassword = config.password || "password";
    this.id = generateSecureID();
    this.connectedCallback = onConnect;
    this.ws = null;
    this.connected = false;
    this.params = params;
  }

  observe(channel = "GLOBAL", callback) {
    if (!this.ws) return;
    this.ws.addEventListener("message", (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "message" && d.channel === channel) callback(d);
    });
  }

  send(data, channel = "GLOBAL") {
    if (!this.ws) return;
    this.ws.send(JSON.stringify({
      type: "message",
      channel,
      data,
      id: this.id
    }));
  }

  connect(space_id = this.space, space_password = this.spacePassword, params = this.params) {
    this.ws = new WebSocket(this._serverURL);
    this.space = space_id;
    this.spacePassword = space_password;

    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({
        type: "connect",
        id: this.id,
        space: this.space,
        password: this.spacePassword,
        params
      }));
    };

    this.ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.type === "error") {
        if (d.error === "invalid_password") throw new Error("PUSH_SOCKET_ERROR: INVALID PASSWORD.");
        if (d.error === "invalid_space") throw new Error("PUSH_SOCKET_ERROR: INVALID SPACE.");
      } else if (d.type === "connect_success") {
        this.connected = true;
        this.connectedCallback();
      }
    };
  }

  get secureID() {
    return this.id;
  }

  set secureID(_) {
    throw new Error("Cannot set secureID; since it is secure.");
  }

  set serverURL(url) {
    this._serverURL = url;
  }

  get serverURL() {
    return this._serverURL;
  }
}

export { PushSocket };
