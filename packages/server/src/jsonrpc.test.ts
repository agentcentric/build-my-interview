import { describe, expect, it } from "vitest";
import { ErrorCode, isRequest, parseMessage } from "./jsonrpc.js";

describe("parseMessage", () => {
	it("parses a request", () => {
		const result = parseMessage('{"jsonrpc":"2.0","id":1,"method":"ping"}');
		expect(result).toEqual({
			ok: true,
			message: { jsonrpc: "2.0", id: 1, method: "ping" },
		});
		expect(result.ok && isRequest(result.message)).toBe(true);
	});

	it("parses a notification, which has no id", () => {
		const result = parseMessage(
			'{"jsonrpc":"2.0","method":"notifications/initialized"}',
		);
		expect(result.ok && isRequest(result.message)).toBe(false);
	});

	it("answers broken JSON with a parse error", () => {
		const result = parseMessage("{not json");
		expect(result).toEqual({
			ok: false,
			response: {
				jsonrpc: "2.0",
				id: null,
				error: { code: ErrorCode.ParseError, message: "Parse error" },
			},
		});
	});

	it("rejects a message without the 2.0 version tag, keeping its id", () => {
		const result = parseMessage('{"id":7,"method":"ping"}');
		expect(result.ok).toBe(false);
		expect(!result.ok && result.response).toMatchObject({
			id: 7,
			error: { code: ErrorCode.InvalidRequest },
		});
	});

	it("rejects ids that are not a string or number", () => {
		const result = parseMessage('{"jsonrpc":"2.0","id":{},"method":"ping"}');
		expect(!result.ok && result.response).toMatchObject({
			id: null,
			error: { code: ErrorCode.InvalidRequest },
		});
	});

	it("rejects arrays, since batches are not part of MCP", () => {
		expect(parseMessage("[]").ok).toBe(false);
	});
});
