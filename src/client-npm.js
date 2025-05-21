"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushSocket = void 0;
var SGen_js_1 = require("./SGen.js");
var PushSocket = /** @class */ (function () {
    function PushSocket(config, params, onConnect) {
        if (config === void 0) { config = {}; }
        if (params === void 0) { params = {}; }
        if (onConnect === void 0) { onConnect = function () { }; }
        this.ws = null;
        this.connected = false;
        this._serverURL = "wss://ps-01.xapktech.xyz";
        this.config = config;
        this.space = config.space_id || "global";
        this.spacePassword = config.password || "password";
        this.id = (0, SGen_js_1.generateSecureID)();
        this.connectedCallback = onConnect;
        this.params = params;
    }
    PushSocket.prototype.observe = function (channel, callback) {
        if (channel === void 0) { channel = "GLOBAL"; }
        if (!this.ws)
            return;
        this.ws.addEventListener("message", function (e) {
            var d = JSON.parse(e.data);
            if (d.type === "message" && d.channel === channel)
                callback(d);
        });
    };
    PushSocket.prototype.send = function (data, channel) {
        if (channel === void 0) { channel = "GLOBAL"; }
        if (!this.ws)
            return;
        this.ws.send(JSON.stringify({
            type: "message",
            channel: channel,
            data: data,
            id: this.id
        }));
    };
    PushSocket.prototype.connect = function (space_id, space_password, params) {
        var _this = this;
        if (space_id === void 0) { space_id = this.space; }
        if (space_password === void 0) { space_password = this.spacePassword; }
        if (params === void 0) { params = this.params; }
        this.ws = new WebSocket(this._serverURL);
        this.space = space_id;
        this.spacePassword = space_password;
        this.ws.onopen = function () {
            var _a;
            (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                type: "connect",
                id: _this.id,
                space: _this.space,
                password: _this.spacePassword,
                params: params
            }));
        };
        this.ws.onmessage = function (e) {
            var d = JSON.parse(e.data);
            if (d.type === "error") {
                if (d.error === "invalid_password")
                    throw new Error("PUSH_SOCKET_ERROR: INVALID PASSWORD.");
                if (d.error === "invalid_space")
                    throw new Error("PUSH_SOCKET_ERROR: INVALID SPACE.");
            }
            else if (d.type === "connect_success") {
                _this.connected = true;
                _this.connectedCallback();
            }
        };
    };
    Object.defineProperty(PushSocket.prototype, "secureID", {
        get: function () {
            return this.id;
        },
        set: function (_) {
            throw new Error("Cannot set secureID; since it is secure.");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PushSocket.prototype, "serverURL", {
        get: function () {
            return this._serverURL;
        },
        set: function (url) {
            this._serverURL = url;
        },
        enumerable: false,
        configurable: true
    });
    return PushSocket;
}());
exports.PushSocket = PushSocket;
