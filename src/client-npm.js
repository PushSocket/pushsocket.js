"use strict";
// This module is PushSocket.js on NPM.
// https://npmjs.com/package/pushsocket.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushSocket = void 0;
var SGen_js_1 = require("./SGen.js");
var PushSocket = /** @class */ (function () {
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
    function PushSocket(config, params, onConnect) {
        var _this = this;
        this.__noop__ = function () {
            return;
        };
        this.space = (config === null || config === void 0 ? void 0 : config.space_id) || "global";
        this.connectedCallback = onConnect;
        this.spacePassword = (config === null || config === void 0 ? void 0 : config.password) || "password";
        this.id = (0, SGen_js_1.generateSecureID)();
        this.connected = false;
        this.ws = new WebSocket("wss://ps-01.memblu.live");
        this.ws.onopen = function () {
            _this.ws.send(JSON.stringify({
                type: "connect",
                id: _this.id,
                space: _this.space,
                password: _this.spacePassword,
                params: params
            }));
        };
        this.ws.onmessage = function (e) {
            var d = JSON.parse(e.data);
            if (d.type == "error") {
                if (d.error == "invalid_password") {
                    throw new Error("PUSH_SOCKET_ERROR: INVALID PASSWORD.");
                }
                else if (d.error == "invalid_space") {
                    throw new Error("PUSH_SOCKET_ERROR: INVALID SPACE.");
                }
            }
            else if (d.type == "connect_success") {
                _this.connected = true;
                _this.connectedCallback();
            }
        };
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
    PushSocket.prototype.observe = function (channel, callback) {
        this.ws.addEventListener("message", function (e) {
            var d = JSON.parse(e.data);
            channel = channel || "GLOBAL";
            if (d.type !== "message")
                return;
            if (d.channel !== channel)
                return;
            callback(d);
        });
    };
    /**
    * Send Method; sends data (param 1) to a specified channel (param 2).
    * If param 2 is not given, channel will default to "GLOBAL"
    * ```js
    * PushSocket.send("<channel: String>", "<data: String>");
    * ```
    */
    PushSocket.prototype.send = function (data, channel) {
        this.ws.send(JSON.stringify({
            type: "message",
            channel: channel || "GLOBAL",
            data: data,
            id: this.id
        }));
    };
    /**
    * Connect Method; if you get disconnected from the space, you can call this method with the space id and space password again to reconnect.
    * PARAM 1: space_id: String, the space to connect to.
    * PARAM 2: space_password: String, the password to the space.
    */
    PushSocket.prototype.connect = function (space_id, space_password, params) {
        var _this = this;
        if (space_id === void 0) { space_id = "global"; }
        if (space_password === void 0) { space_password = "password"; }
        this.ws = new WebSocket("wss://pushserver.cubicdev.repl.co");
        this.space = space_id;
        this.spacePassword = space_password;
        this.ws.onopen = function () {
            _this.ws.send(JSON.stringify({
                type: "connect",
                id: _this.id,
                space: _this.space,
                password: _this.spacePassword,
                params: params
            }));
        };
    };
    Object.defineProperty(PushSocket.prototype, "secureID", {
        /**
        * ``secureID`` property; returns the secure id of the socket.
        */
        get: function () {
            return this.id;
        },
        set: function (id) {
            throw new Error("Cannot set secureID; since it is secure.");
        },
        enumerable: false,
        configurable: true
    });
    return PushSocket;
}());
exports.PushSocket = PushSocket;
