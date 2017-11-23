/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.TracerState = (function() {

    /**
     * Properties of a TracerState.
     * @exports ITracerState
     * @interface ITracerState
     * @property {number|Long} [traceId] TracerState traceId
     * @property {number|Long} [spanId] TracerState spanId
     * @property {boolean} [sampled] TracerState sampled
     * @property {Object.<string,string>} [baggageItems] TracerState baggageItems
     */

    /**
     * Constructs a new TracerState.
     * @exports TracerState
     * @classdesc Represents a TracerState.
     * @constructor
     * @param {ITracerState=} [properties] Properties to set
     */
    function TracerState(properties) {
        this.baggageItems = {};
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TracerState traceId.
     * @member {number|Long}traceId
     * @memberof TracerState
     * @instance
     */
    TracerState.prototype.traceId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * TracerState spanId.
     * @member {number|Long}spanId
     * @memberof TracerState
     * @instance
     */
    TracerState.prototype.spanId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * TracerState sampled.
     * @member {boolean}sampled
     * @memberof TracerState
     * @instance
     */
    TracerState.prototype.sampled = false;

    /**
     * TracerState baggageItems.
     * @member {Object.<string,string>}baggageItems
     * @memberof TracerState
     * @instance
     */
    TracerState.prototype.baggageItems = $util.emptyObject;

    /**
     * Creates a new TracerState instance using the specified properties.
     * @function create
     * @memberof TracerState
     * @static
     * @param {ITracerState=} [properties] Properties to set
     * @returns {TracerState} TracerState instance
     */
    TracerState.create = function create(properties) {
        return new TracerState(properties);
    };

    /**
     * Encodes the specified TracerState message. Does not implicitly {@link TracerState.verify|verify} messages.
     * @function encode
     * @memberof TracerState
     * @static
     * @param {ITracerState} message TracerState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TracerState.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.traceId != null && message.hasOwnProperty("traceId"))
            writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.traceId);
        if (message.spanId != null && message.hasOwnProperty("spanId"))
            writer.uint32(/* id 2, wireType 1 =*/17).fixed64(message.spanId);
        if (message.sampled != null && message.hasOwnProperty("sampled"))
            writer.uint32(/* id 3, wireType 0 =*/24).bool(message.sampled);
        if (message.baggageItems != null && message.hasOwnProperty("baggageItems"))
            for (var keys = Object.keys(message.baggageItems), i = 0; i < keys.length; ++i)
                writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.baggageItems[keys[i]]).ldelim();
        return writer;
    };

    /**
     * Encodes the specified TracerState message, length delimited. Does not implicitly {@link TracerState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TracerState
     * @static
     * @param {ITracerState} message TracerState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TracerState.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TracerState message from the specified reader or buffer.
     * @function decode
     * @memberof TracerState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TracerState} TracerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TracerState.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TracerState(), key;
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.traceId = reader.fixed64();
                break;
            case 2:
                message.spanId = reader.fixed64();
                break;
            case 3:
                message.sampled = reader.bool();
                break;
            case 4:
                reader.skip().pos++;
                if (message.baggageItems === $util.emptyObject)
                    message.baggageItems = {};
                key = reader.string();
                reader.pos++;
                message.baggageItems[key] = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TracerState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TracerState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TracerState} TracerState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TracerState.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TracerState message.
     * @function verify
     * @memberof TracerState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TracerState.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.traceId != null && message.hasOwnProperty("traceId"))
            if (!$util.isInteger(message.traceId) && !(message.traceId && $util.isInteger(message.traceId.low) && $util.isInteger(message.traceId.high)))
                return "traceId: integer|Long expected";
        if (message.spanId != null && message.hasOwnProperty("spanId"))
            if (!$util.isInteger(message.spanId) && !(message.spanId && $util.isInteger(message.spanId.low) && $util.isInteger(message.spanId.high)))
                return "spanId: integer|Long expected";
        if (message.sampled != null && message.hasOwnProperty("sampled"))
            if (typeof message.sampled !== "boolean")
                return "sampled: boolean expected";
        if (message.baggageItems != null && message.hasOwnProperty("baggageItems")) {
            if (!$util.isObject(message.baggageItems))
                return "baggageItems: object expected";
            var key = Object.keys(message.baggageItems);
            for (var i = 0; i < key.length; ++i)
                if (!$util.isString(message.baggageItems[key[i]]))
                    return "baggageItems: string{k:string} expected";
        }
        return null;
    };

    /**
     * Creates a TracerState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TracerState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TracerState} TracerState
     */
    TracerState.fromObject = function fromObject(object) {
        if (object instanceof $root.TracerState)
            return object;
        var message = new $root.TracerState();
        if (object.traceId != null)
            if ($util.Long)
                (message.traceId = $util.Long.fromValue(object.traceId)).unsigned = false;
            else if (typeof object.traceId === "string")
                message.traceId = parseInt(object.traceId, 10);
            else if (typeof object.traceId === "number")
                message.traceId = object.traceId;
            else if (typeof object.traceId === "object")
                message.traceId = new $util.LongBits(object.traceId.low >>> 0, object.traceId.high >>> 0).toNumber();
        if (object.spanId != null)
            if ($util.Long)
                (message.spanId = $util.Long.fromValue(object.spanId)).unsigned = false;
            else if (typeof object.spanId === "string")
                message.spanId = parseInt(object.spanId, 10);
            else if (typeof object.spanId === "number")
                message.spanId = object.spanId;
            else if (typeof object.spanId === "object")
                message.spanId = new $util.LongBits(object.spanId.low >>> 0, object.spanId.high >>> 0).toNumber();
        if (object.sampled != null)
            message.sampled = Boolean(object.sampled);
        if (object.baggageItems) {
            if (typeof object.baggageItems !== "object")
                throw TypeError(".TracerState.baggageItems: object expected");
            message.baggageItems = {};
            for (var keys = Object.keys(object.baggageItems), i = 0; i < keys.length; ++i)
                message.baggageItems[keys[i]] = String(object.baggageItems[keys[i]]);
        }
        return message;
    };

    /**
     * Creates a plain object from a TracerState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TracerState
     * @static
     * @param {TracerState} message TracerState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TracerState.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.objects || options.defaults)
            object.baggageItems = {};
        if (options.defaults) {
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.traceId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.traceId = options.longs === String ? "0" : 0;
            if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.spanId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.spanId = options.longs === String ? "0" : 0;
            object.sampled = false;
        }
        if (message.traceId != null && message.hasOwnProperty("traceId"))
            if (typeof message.traceId === "number")
                object.traceId = options.longs === String ? String(message.traceId) : message.traceId;
            else
                object.traceId = options.longs === String ? $util.Long.prototype.toString.call(message.traceId) : options.longs === Number ? new $util.LongBits(message.traceId.low >>> 0, message.traceId.high >>> 0).toNumber() : message.traceId;
        if (message.spanId != null && message.hasOwnProperty("spanId"))
            if (typeof message.spanId === "number")
                object.spanId = options.longs === String ? String(message.spanId) : message.spanId;
            else
                object.spanId = options.longs === String ? $util.Long.prototype.toString.call(message.spanId) : options.longs === Number ? new $util.LongBits(message.spanId.low >>> 0, message.spanId.high >>> 0).toNumber() : message.spanId;
        if (message.sampled != null && message.hasOwnProperty("sampled"))
            object.sampled = message.sampled;
        var keys2;
        if (message.baggageItems && (keys2 = Object.keys(message.baggageItems)).length) {
            object.baggageItems = {};
            for (var j = 0; j < keys2.length; ++j)
                object.baggageItems[keys2[j]] = message.baggageItems[keys2[j]];
        }
        return object;
    };

    /**
     * Converts this TracerState to JSON.
     * @function toJSON
     * @memberof TracerState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TracerState.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TracerState;
})();

module.exports = $root;
