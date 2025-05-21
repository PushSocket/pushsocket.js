// This module is PushSocket.js on NPM.
// https://npmjs.com/package/pushsocket.js

import { generateSecureID } from "./SGen.js";

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
  serverURL: string;
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
  * // socket.serverURL = <optional, sets websocket url, must be SetSocket compatible>
  * socket.connect();
  */
  constructor(config: PSConfig, params: object, onConnect: Function) {
    this._serverURL = "wss://ps-01.xapktech.xyz";
    this.config = config;
    this.space = config?.space_id || "global";
    this.connectedCallback = onConnect;
    this.spacePassword = config?.password || "password";
    this.id = generateSecureID();
    this.connected = false;
    // this.ws = new WebSocket("wss://ps-01.xapktech.xyz");

    //this.ws.onopen = () => {
     //this.ws.send(JSON.stringify({
     //type: "connect",
     //id: this.id,
     //space: this.space,
     //password: this.spacePassword,
     //params: params
    //}));
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
      data: data,
      id: this.id
    }));
  }
  /** 
  * Connect Method; if you get disconnected from the space, you can call this method with the space id and space password again to reconnect.
  * PARAM 1: space_id: String, the space to connect to.
  * PARAM 2: space_password: String, the password to the space.
  */
  connect(space_id: string = this.config?.space_id || "global", space_password: string = this.config?.password || "password", params: object) {
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
  * ``secureID`` property; returns the secure id of the socket.
  */
  get secureID() {
    return this.id;
  }

  set secureID(id) {
    throw new Error("Cannot set secureID; since it is secure.");
  }
  
  /**
  * set ```serverURL```: Setting this changes the websocket URL that PushSocket communicates with. Must be SetSocket-compatible and set before connecting.
  */
  set serverURL(id) {
    this._serverURL = id;
  }

  get serverURL() {
    return this._serverURL;
  }

  private __noop__ = () => {
    return;
  }
}

export {
  PushSocket
};
