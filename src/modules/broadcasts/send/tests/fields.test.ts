import { describe, expect, it } from 'vitest';
import { displayFields, fields, sendBroadcastFields } from '../fields.js';

describe('send broadcast fields', () => {
	describe('CLI fields', () => {
		it('should have correct number of fields', () => {
			expect(fields).toHaveLength(2);
		});

		it('should have broadcast-id field', () => {
			const broadcastIdField = fields.find((field) => field.name === 'broadcast-id');
			expect(broadcastIdField).toBeDefined();
			expect(broadcastIdField?.label).toBe('Broadcast ID');
			expect(broadcastIdField?.cliFlag).toBe('--broadcast-id');
			expect(broadcastIdField?.cliShortFlag).toBe('-b');
		});

		it('should have scheduled-at field', () => {
			const scheduledAtField = fields.find((field) => field.name === 'scheduled-at');
			expect(scheduledAtField).toBeDefined();
			expect(scheduledAtField?.label).toBe('Scheduled At');
			expect(scheduledAtField?.cliFlag).toBe('--scheduled-at');
			expect(scheduledAtField?.cliShortFlag).toBe('-s');
		});
	});

	describe('TUI form fields', () => {
		it('should have correct number of fields', () => {
			expect(sendBroadcastFields).toHaveLength(2);
		});

		it('should have broadcastId field', () => {
			const broadcastIdField = sendBroadcastFields.find((field) => field.name === 'broadcastId');
			expect(broadcastIdField).toBeDefined();
			expect(broadcastIdField?.label).toBe('Broadcast ID');
			expect(broadcastIdField?.type).toBe('input-with-selector');
		});

		it('should have scheduledAt field', () => {
			const scheduledAtField = sendBroadcastFields.find((field) => field.name === 'scheduledAt');
			expect(scheduledAtField).toBeDefined();
			expect(scheduledAtField?.label).toBe('Scheduled At');
			expect(scheduledAtField?.type).toBe('text');
		});
	});

	describe('Display fields', () => {
		it('should have correct number of fields', () => {
			expect(displayFields).toHaveLength(1);
		});

		it('should have id field', () => {
			const idField = displayFields.find((field) => field.name === 'id');
			expect(idField).toBeDefined();
			expect(idField?.label).toBe('ID');
			expect(idField?.cliFlag).toBe('--id');
			expect(idField?.cliShortFlag).toBe('-i');
		});
	});
});
