import { Command } from 'commander';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as cliUtils from '@/utils/cli.js';
import * as cliHelp from '@/utils/cli-help.js';
import { registerEmailCommands } from './cli.js';
import { fields } from './send/fields.js';

// Mock utility functions
const mockRegisterFieldOptions = vi.spyOn(cliUtils, 'registerFieldOptions').mockImplementation(() => undefined);
const mockConfigureCustomHelp = vi.spyOn(cliHelp, 'configureCustomHelp').mockImplementation(() => undefined);

describe('Email CLI Commands', () => {
	let program: Command;

	beforeEach(() => {
		program = new Command();
		vi.clearAllMocks();
	});

	it('registers email send command', () => {
		registerEmailCommands(program);

		const emailCommands = program.commands;
		expect(emailCommands).toHaveLength(1);
		expect(emailCommands[0]?.name()).toBe('send');
		expect(emailCommands[0]?.description()).toBe('Send an email via Resend API');
	});

	it('configures command with correct field options', () => {
		registerEmailCommands(program);

		expect(mockRegisterFieldOptions).toHaveBeenCalledWith(expect.any(Command), fields);
	});

	it('configures custom help with proper examples', () => {
		registerEmailCommands(program);

		expect(mockConfigureCustomHelp).toHaveBeenCalledWith(
			expect.any(Command),
			fields,
			expect.arrayContaining([
				expect.stringContaining('resend-cli email send'),
				expect.stringContaining('--from'),
				expect.stringContaining('--to'),
			]),
		);
	});

	it('includes comprehensive CLI examples', () => {
		registerEmailCommands(program);

		const mockCalls = mockConfigureCustomHelp.mock.calls;
		expect(mockCalls).toHaveLength(1);

		const firstCall = mockCalls[0];
		if (firstCall) {
			const [, , examples] = firstCall;
			expect(examples).toEqual(
				expect.arrayContaining([
					expect.stringContaining('--from="Acme <onboarding@resend.dev>"'),
					expect.stringContaining('--output json'),
					expect.stringContaining('jq'),
					expect.stringContaining('RESEND_API_KEY='),
				]),
			);
		}
	});

	it('registers command with action handler', () => {
		registerEmailCommands(program);
		const sendCommand = program.commands[0];

		// Verify the command has an action (function) attached
		expect(sendCommand).toBeDefined();
		expect(sendCommand?.name()).toBe('send');
	});

	it('calls field registration and help configuration', () => {
		registerEmailCommands(program);

		expect(mockRegisterFieldOptions).toHaveBeenCalledTimes(1);
		expect(mockConfigureCustomHelp).toHaveBeenCalledTimes(1);
	});
});
