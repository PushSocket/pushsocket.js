// This module is PushSocket.js on NPM.
// https://npmjs.com/package/pushsocket.js

import { generateSecureID } from "./SGen.js";
const WebSocket = require("ws");

/** 
* Interface ``PSConfig``; the specification of a PushSocket config object.
*/
interface PSConfig {
  space_id: string;
  password: string;
}
/** 
* Interface ``PushSocket``; the interface for the PushSocket class.
*/
interface PushSocket {
  space: string;
  spacePassword: string;
  id: string;
  ws: WebSocket;
  connected: boolean;
  connectedCallback: Function;
}
/** 
* Interface ``SocketMessage``; the specification of a PushSocket message.
*/
interface SocketMessage {
  type: string;
  data: string;
  channel: string;
  sender?: string;
}

class PushSocket {
  /**
  * PushSocket constructor; Accepts a config object, params to be passed to the space, and a callback to be called when the socket is connected.
  *
  * Below is an example of importing and initalizing PushSocket.
  * ```js
  * // as CommonJS Module
  * const ps = require("pushsocket.js");
  * // as ES Module
  * import * as ps from "pushsocket.js";
  *
  * const socket = new ps.PushSocket(
  *   {
  *     // space_id: optional, defaults to "global"
  *     space_id: "<space: String>",
  *     // password: optional, defaults to "password"
  *     password: "<password: String>"
  *   },
  *   null, // null, no params to the space.
  *   handleConnect // will be called when the socket is connected.
  * );
  */
  constructor(config: PSConfig, params: Object, onConnect: Function) {
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

  /** 
  * Observe Method; Observes a channel for message(s).
  * Usage: 
  * ```js
  * // channel: optional, defaults to "GLOBAL"
  *
  * PushSocket.observe("<channel: String>", (msg) => {
  *   // ``msg.data<String>`` for the message contents. 
  * });
  * ```
  */
  observe(channel: string, callback: Function) {
    this.ws.addEventListener("message", (e) => {
      const d: SocketMessage = JSON.parse(e.data);
      channel = channel || "GLOBAL";

      if (d.type !== "message") return;
      if (d.channel !== channel) return;

      callback(d);
    });
  }

  /** 
  * Send Method; sends data (param 1) to a specified channel (param 2).
  * If param 2 is not given, channel will default to "GLOBAL"
  * ```js
  * PushSocket.send("<channel: String>", "<data: String>");
  * ```
  */
  send(data: string, channel: string) {
    this.ws.send(JSON.stringify({
      type: "message",
      channel: channel || "GLOBAL",
      data: data
    }));
  }
  /** 
  * ``secureID`` property; returns the secure id of the socket.
  */
  get secureID() {
    return this.id;
  }

  set secureID(id) {
    throw new Error("Cannot set secureID; since it is secure.");
  }

  private __noop__ = () => {
    return;
  }
}

export {
  PushSocket
};