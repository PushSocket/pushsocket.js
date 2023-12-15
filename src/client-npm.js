"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushSocket = void 0;
var SGen_js_1 = require("./SGen.js");
var WebSocket = require("ws");
var PushSocket = /** @class */ (function () {
    /**
     * @param {Object} config - The configuration for PushSocket. Decides space to connect to, socketID, and password for space.
     * @param {Object} params - The parameters passed to the space when connected.
     */
    function PushSocket(config, params, onConnect) {
        var _this = this;
        this.space = config.space_id || "global";
        this.connectedCallback = onConnect;
        this.spacePassword = config.password || "password";
        this.id = (0, SGen_js_1.generateSecureID)();
        this.connected = false;
        this.ws = new WebSocket("wss://pushserver.cubicdev.repl.co");
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
    PushSocket.prototype.observe = function (channel, callback) {
        this.ws.addEventListener("message", function (e) {
            var d = JSON.parse(e.data);
            if (d.type !== "message")
                return;
            if (d.channel !== channel)
                return;
            callback(d);
        });
    };
    PushSocket.prototype.send = function (data, channel) {
        this.ws.send(JSON.stringify({
            type: "message",
            channel: channel,
            data: data
        }));
    };
    Object.defineProperty(PushSocket.prototype, "secureID", {
        get: function () {
            return this.id;
        },
        set: function (id) {
            throw new Error("Cannot set secureID; since it is secure.");
        },
        enumerable: false,
        configurable: true
    });
    PushSocket.prototype.__noop__ = function () {
        return;
    };
    return PushSocket;
}());
exports.PushSocket = PushSocket;
