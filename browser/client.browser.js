// PushSocket.js (browser-ready)
// Replace this with your secure ID generator or a placeholder
import { generateSecureID } from './SGen.js'; // Make sure SGen.js is browser-friendly

class PushSocket {
  constructor(config, params, onConnect) {
    this._serverURL = "wss://ps-01.xapktech.xyz";
    this.config = config;
    this.space = config?.space_id || "global";
    this.connectedCallback = onConnect;
    this.spacePassword = config?.password || "password";
    this.id = generateSecureID();
    this.connected = false;
    this.ws = null;
    this.params = params;
  }

  observe(channel, callback) {
    if (!this.ws) return;
    this.ws.addEventListener("message", (e) => {
      const d = JSON.parse(e.data);
      channel = channel || "GLOBAL";

      if (d.type !== "message") return;
      if (d.channel !== channel) return;

      callback(d);
    });
  }

  send(data, channel) {
    if (!this.ws) return;
    this.ws.send(JSON.stringify({
      type: "message",
      channel: channel || "GLOBAL",
      data: data,
      id: this.id
    }));
  }

  connect(space_id = this.config?.space_id || "global", space_password = this.config?.password || "password", params = this.params) {
    this.ws = new WebSocket(this._serverURL);
    this.space = space_id;
    this.spacePassword = space_password;

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: "connect",
        id: this.id,
        space: this.space,
        password: this.spacePassword,
        params: params
      }));
    };

    this.ws.onmessage = (e) => {
      const d = JSON.parse(e.data);

      if (d.type === "error") {
        if (d.error === "invalid_password") {
          throw new Error("PUSH_SOCKET_ERROR: INVALID PASSWORD.");
        } else if (d.error === "invalid_space") {
          throw new Error("PUSH_SOCKET_ERROR: INVALID SPACE.");
        }
      } else if (d.type === "connect_success") {
        this.connected = true;
        if (typeof this.connectedCallback === "function") {
          this.connectedCallback();
        }
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
