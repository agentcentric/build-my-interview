// JSON-RPC 2.0 message shapes and parsing, written by hand.
// Spec: https://www.jsonrpc.org/specification
// MCP sends one JSON-RPC message per line over stdin/stdout.

export type JsonRpcId = string | number;

/** A call that expects a response, because it carries an id. */
export interface JsonRpcRequest {
	jsonrpc: "2.0";
	id: JsonRpcId;
	method: string;
	params?: unknown;
}

/** A one-way message. It has no id, so it must never get a response. */
export interface JsonRpcNotification {
	jsonrpc: "2.0";
	method: string;
	params?: unknown;
}

export interface JsonRpcError {
	code: number;
	message: string;
	data?: unknown;
}

export type JsonRpcResponse =
	| { jsonrpc: "2.0"; id: JsonRpcId; result: unknown }
	| { jsonrpc: "2.0"; id: JsonRpcId | null; error: JsonRpcError };

/** Standard error codes from the spec. */
export const ErrorCode = {
	ParseError: -32700,
	InvalidRequest: -32600,
	MethodNotFound: -32601,
	InvalidParams: -32602,
	InternalError: -32603,
} as const;

export type ParseResult =
	| { ok: true; message: JsonRpcRequest | JsonRpcNotification }
	| { ok: false; response: JsonRpcResponse };

/**
 * Turn one line of input into a request or notification.
 * Bad input becomes the error response the spec says to send back.
 */
export function parseMessage(line: string): ParseResult {
	let data: unknown;
	try {
		data = JSON.parse(line);
	} catch {
		return fail(null, ErrorCode.ParseError, "Parse error");
	}

	if (typeof data !== "object" || data === null || Array.isArray(data)) {
		return fail(null, ErrorCode.InvalidRequest, "Invalid Request");
	}

	const msg = data as Record<string, unknown>;
	const id = isValidId(msg.id) ? msg.id : null;

	if (msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
		return fail(id, ErrorCode.InvalidRequest, "Invalid Request");
	}
	if ("id" in msg && !isValidId(msg.id)) {
		return fail(null, ErrorCode.InvalidRequest, "Invalid Request");
	}

	return {
		ok: true,
		message: msg as unknown as JsonRpcRequest | JsonRpcNotification,
	};
}

export function isRequest(
	message: JsonRpcRequest | JsonRpcNotification,
): message is JsonRpcRequest {
	return "id" in message;
}

function isValidId(value: unknown): value is JsonRpcId {
	return typeof value === "string" || typeof value === "number";
}

function fail(
	id: JsonRpcId | null,
	code: number,
	message: string,
): ParseResult {
	return {
		ok: false,
		response: { jsonrpc: "2.0", id, error: { code, message } },
	};
}
