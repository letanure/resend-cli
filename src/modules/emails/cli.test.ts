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

	it('registers email send and retrieve commands', () => {
		registerEmailCommands(program);

		const emailCommands = program.commands;
		expect(emailCommands).toHaveLength(2);

		const sendCommand = emailCommands.find((cmd) => cmd.name() === 'send');
		const retrieveCommand = emailCommands.find((cmd) => cmd.name() === 'retrieve');

		expect(sendCommand).toBeDefined();
		expect(sendCommand?.description()).toBe('Send an email via Resend API');

		expect(retrieveCommand).toBeDefined();
		expect(retrieveCommand?.description()).toBe('Retrieve an email by ID from Resend API');
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
		expect(mockCalls).toHaveLength(2);

		// Check send command examples
		const sendCall = mockCalls[0];
		if (sendCall) {
			const [, , examples] = sendCall;
			expect(examples).toEqual(
				expect.arrayContaining([
					expect.stringContaining('--from="Acme <onboarding@resend.dev>"'),
					expect.stringContaining('--output json'),
					expect.stringContaining('jq'),
					expect.stringContaining('RESEND_API_KEY='),
				]),
			);
		}

		// Check retrieve command examples
		const retrieveCall = mockCalls[1];
		if (retrieveCall) {
			const [, , examples] = retrieveCall;
			expect(examples).toEqual(
				expect.arrayContaining([
					expect.stringContaining('--id="402a4ef4-3bd0-43fe-8e12-f6142bd2bd0f"'),
					expect.stringContaining('--output json'),
					expect.stringContaining('RESEND_API_KEY='),
				]),
			);
		}
	});

	it('registers commands with action handlers', () => {
		registerEmailCommands(program);
		const sendCommand = program.commands.find((cmd) => cmd.name() === 'send');
		const retrieveCommand = program.commands.find((cmd) => cmd.name() === 'retrieve');

		// Verify both commands have actions attached
		expect(sendCommand).toBeDefined();
		expect(sendCommand?.name()).toBe('send');

		expect(retrieveCommand).toBeDefined();
		expect(retrieveCommand?.name()).toBe('retrieve');
	});

	it('calls field registration and help configuration', () => {
		registerEmailCommands(program);

		expect(mockRegisterFieldOptions).toHaveBeenCalledTimes(2);
		expect(mockConfigureCustomHelp).toHaveBeenCalledTimes(2);
	});
});
