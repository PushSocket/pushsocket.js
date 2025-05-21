// PushSocket.browser.js

import { generateSecureID } from "";

/**
 * Interface-like JSDoc to help with intellisense and clarity
 * @typedef {Object} PSConfig
 * @property {string} space_id
 * @property {string} password
 */

class PushSocket {
  /**
   * @param {PSConfig} config
   * @param {Object} params
   * @param {Function} onConnect
   */
  constructor(config, params, onConnect) {
    this.config = config || {};
    this.space = config?.space_id || "global";
    this.spacePassword = config?.password || "password";
    this.id = generateSecureID();
    this.connectedCallback = onConnect;
    this.connected = false;
    this._serverURL = "wss://ps-01.xapktech.xyz";
    this._params = params || {};
  }

  observe(channel, callback) {
    this.ws.addEventListener("message", (e) => {
      let d;
      try {
        d = JSON.parse(e.data);
      } catch {
        return;
      }

      channel = channel || "GLOBAL";
      if (d.type !== "message" || d.channel !== channel) return;

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

  connect(space_id = this.space, space_password = this.spacePassword, params = this._params) {
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
      let d;
      try {
        d = JSON.parse(e.data);
      } catch {
        return;
      }

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
    throw new Error("Cannot set secureID; it is secure.");
  }

  get serverURL() {
    return this._serverURL;
  }

  set serverURL(url) {
    this._serverURL = url;
  }
}

export { PushSocket };
