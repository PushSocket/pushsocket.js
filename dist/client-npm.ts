import { generateSecureID } from "./SGen.js";

interface PSConfig {
  space_id?: string;
  password?: string;
}

interface SocketMessage {
  type: string;
  data: string;
  channel: string;
  sender?: string;
}

class PushSocket {
  private _serverURL: string;
  private config: PSConfig;
  private space: string;
  private spacePassword: string;
  private id: string;
  private connectedCallback: () => void;
  private ws: WebSocket | null = null;
  private connected: boolean = false;
  private params: object;

  constructor(config: PSConfig = {}, params: object = {}, onConnect: () => void = () => {}) {
    this._serverURL = "wss://ps-01.xapktech.xyz";
    this.config = config;
    this.space = config.space_id || "global";
    this.spacePassword = config.password || "password";
    this.id = generateSecureID();
    this.connectedCallback = onConnect;
    this.params = params;
  }

  observe(channel: string = "GLOBAL", callback: (msg: SocketMessage) => void) {
    if (!this.ws) return;
    this.ws.addEventListener("message", (e) => {
      const d: SocketMessage = JSON.parse(e.data);
      if (d.type === "message" && d.channel === channel) callback(d);
    });
  }

  send(data: string, channel: string = "GLOBAL") {
    if (!this.ws) return;
    this.ws.send(JSON.stringify({
      type: "message",
      channel,
      data,
      id: this.id
    }));
  }

  connect(space_id: string = this.space, space_password: string = this.spacePassword, params: object = this.params) {
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

  set serverURL(url: string) {
    this._serverURL = url;
  }

  get serverURL() {
    return this._serverURL;
  }
}

export { PushSocket };
