import { Command } from 'commander';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as cliUtils from '@/utils/cli.js';
import * as cliHelp from '@/utils/cli-help.js';
import { registerEmailCommands } from '../cli.js';
import { fields } from '../send/fields.js';

// Mock utility functions
const mockRegisterFieldOptions = vi.spyOn(cliUtils, 'registerFieldOptions').mockImplementation(() => undefined);
const mockConfigureCustomHelp = vi.spyOn(cliHelp, 'configureCustomHelp').mockImplementation(() => undefined);

describe('Email CLI Commands', () => {
	let program: Command;

	beforeEach(() => {
		program = new Command();
		vi.clearAllMocks();
	});

	it('registers email send, retrieve, update, and cancel commands', () => {
		registerEmailCommands(program);

		const emailCommands = program.commands;
		expect(emailCommands).toHaveLength(4);

		const sendCommand = emailCommands.find((cmd) => cmd.name() === 'send');
		const retrieveCommand = emailCommands.find((cmd) => cmd.name() === 'retrieve');
		const updateCommand = emailCommands.find((cmd) => cmd.name() === 'update');
		const cancelCommand = emailCommands.find((cmd) => cmd.name() === 'cancel');

		expect(sendCommand).toBeDefined();
		expect(sendCommand?.description()).toBe('Send an email via Resend API');

		expect(retrieveCommand).toBeDefined();
		expect(retrieveCommand?.description()).toBe('Retrieve an email by ID from Resend API');

		expect(updateCommand).toBeDefined();
		expect(updateCommand?.description()).toBe('Update a scheduled email via Resend API');

		expect(cancelCommand).toBeDefined();
		expect(cancelCommand?.description()).toBe('Cancel a scheduled email via Resend API');
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
		expect(mockCalls).toHaveLength(4);

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

		// Check update command examples
		const updateCall = mockCalls[2];
		if (updateCall) {
			const [, , examples] = updateCall;
			expect(examples).toEqual(
				expect.arrayContaining([
					expect.stringContaining('--id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"'),
					expect.stringContaining('--scheduled-at="2024-08-05T11:52:01.858Z"'),
					expect.stringContaining('--output json'),
					expect.stringContaining('RESEND_API_KEY='),
				]),
			);
		}

		// Check cancel command examples
		const cancelCall = mockCalls[3];
		if (cancelCall) {
			const [, , examples] = cancelCall;
			expect(examples).toEqual(
				expect.arrayContaining([
					expect.stringContaining('--id="49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"'),
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
		const updateCommand = program.commands.find((cmd) => cmd.name() === 'update');
		const cancelCommand = program.commands.find((cmd) => cmd.name() === 'cancel');

		// Verify all commands have actions attached
		expect(sendCommand).toBeDefined();
		expect(sendCommand?.name()).toBe('send');

		expect(retrieveCommand).toBeDefined();
		expect(retrieveCommand?.name()).toBe('retrieve');

		expect(updateCommand).toBeDefined();
		expect(updateCommand?.name()).toBe('update');

		expect(cancelCommand).toBeDefined();
		expect(cancelCommand?.name()).toBe('cancel');
	});

	it('calls field registration and help configuration', () => {
		registerEmailCommands(program);

		expect(mockRegisterFieldOptions).toHaveBeenCalledTimes(4);
		expect(mockConfigureCustomHelp).toHaveBeenCalledTimes(4);
	});
});
