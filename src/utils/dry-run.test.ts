import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CliField } from '@/types/index.js';
import { logDryRunResults } from './dry-run.js';

// Mock console methods
const mockConsoleLog = vi.fn();
const originalConsoleLog = console.log;

beforeEach(() => {
	mockConsoleLog.mockClear();
	console.log = mockConsoleLog;
});

afterEach(() => {
	console.log = originalConsoleLog;
});

describe('dry-run utility', () => {
	const mockFields: Array<CliField> = [
		{
			name: 'from',
			label: 'From',
			placeholder: 'sender@example.com',
			helpText: 'Sender email address',
			cliFlag: 'from',
			cliShortFlag: 'f',
		},
		{
			name: 'subject',
			label: 'Subject',
			placeholder: 'Email subject',
			helpText: 'Email subject line',
			cliFlag: 'subject',
			cliShortFlag: 's',
		},
	];

	const mockData = {
		from: 'test@example.com',
		subject: 'Test Subject',
		emptyField: '',
	};

	const mockMetadata = {
		'API Key': 're_1234567890...',
		'Dry Run': 'true',
	};

	it('should log complete dry-run results with proper structure', () => {
		logDryRunResults(mockData, mockFields, 'Test Title', mockMetadata, 'Test message');

		// Verify title is logged
		expect(mockConsoleLog).toHaveBeenCalledWith('Test Title');

		// Verify field data is logged (only non-empty fields)
		expect(mockConsoleLog).toHaveBeenCalledWith('From:', 'test@example.com');
		expect(mockConsoleLog).toHaveBeenCalledWith('Subject:', 'Test Subject');

		// Verify empty fields are not logged
		expect(mockConsoleLog).not.toHaveBeenCalledWith('emptyField:', '');

		// Verify metadata is logged
		expect(mockConsoleLog).toHaveBeenCalledWith('API Key:', 're_1234567890...');
		expect(mockConsoleLog).toHaveBeenCalledWith('Dry Run:', 'true');

		// Verify message structure (empty line, message, empty line)
		expect(mockConsoleLog).toHaveBeenCalledWith('');
		expect(mockConsoleLog).toHaveBeenCalledWith('Test message');
	});

	it('should handle textarea fields with truncation', () => {
		const longTextField: CliField = {
			name: 'html',
			label: 'HTML Content',
			placeholder: 'HTML content',
			helpText: 'HTML message content',
			type: 'textarea',
			cliFlag: 'html',
			cliShortFlag: 'h',
		};

		const longData = {
			html: 'a'.repeat(150), // String longer than 100 characters
		};

		logDryRunResults(longData, [longTextField], 'Test', {}, 'Test');

		// Should truncate long textarea content
		expect(mockConsoleLog).toHaveBeenCalledWith('HTML Content:', `${'a'.repeat(100)}...`);
	});

	it('should handle array values by joining them', () => {
		const arrayField: CliField = {
			name: 'to',
			label: 'Recipients',
			placeholder: 'recipients',
			helpText: 'Email recipients',
			cliFlag: 'to',
			cliShortFlag: 't',
		};

		const arrayData = {
			to: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
		};

		logDryRunResults(arrayData, [arrayField], 'Test', {}, 'Test');

		expect(mockConsoleLog).toHaveBeenCalledWith(
			'Recipients:',
			'user1@example.com, user2@example.com, user3@example.com',
		);
	});
});
