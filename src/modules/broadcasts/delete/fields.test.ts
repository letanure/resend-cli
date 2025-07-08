import { describe, expect, it } from 'vitest';
import { deleteBroadcastFields, displayFields, fields } from './fields.js';

describe('delete broadcast fields', () => {
	describe('CLI fields', () => {
		it('should have correct number of fields', () => {
			expect(fields).toHaveLength(1);
		});

		it('should have broadcast-id field', () => {
			const broadcastIdField = fields.find((field) => field.name === 'broadcast-id');
			expect(broadcastIdField).toBeDefined();
			expect(broadcastIdField?.label).toBe('Broadcast ID');
			expect(broadcastIdField?.cliFlag).toBe('--broadcast-id');
			expect(broadcastIdField?.cliShortFlag).toBe('-b');
			expect(broadcastIdField?.helpText).toContain('delete');
		});
	});

	describe('TUI form fields', () => {
		it('should have correct number of fields', () => {
			expect(deleteBroadcastFields).toHaveLength(1);
		});

		it('should have broadcastId field', () => {
			const broadcastIdField = deleteBroadcastFields.find((field) => field.name === 'broadcastId');
			expect(broadcastIdField).toBeDefined();
			expect(broadcastIdField?.label).toBe('Broadcast ID');
			expect(broadcastIdField?.type).toBe('text');
			expect(broadcastIdField?.helpText).toContain('delete');
			expect(broadcastIdField?.helpText).toContain('draft');
		});
	});

	describe('Display fields', () => {
		it('should have correct number of fields', () => {
			expect(displayFields).toHaveLength(3);
		});

		it('should have object field', () => {
			const objectField = displayFields.find((field) => field.name === 'object');
			expect(objectField).toBeDefined();
			expect(objectField?.label).toBe('Object');
			expect(objectField?.cliFlag).toBe('--object');
			expect(objectField?.cliShortFlag).toBe('-o');
		});

		it('should have id field', () => {
			const idField = displayFields.find((field) => field.name === 'id');
			expect(idField).toBeDefined();
			expect(idField?.label).toBe('ID');
			expect(idField?.cliFlag).toBe('--id');
			expect(idField?.cliShortFlag).toBe('-i');
		});

		it('should have deleted field', () => {
			const deletedField = displayFields.find((field) => field.name === 'deleted');
			expect(deletedField).toBeDefined();
			expect(deletedField?.label).toBe('Deleted');
			expect(deletedField?.cliFlag).toBe('--deleted');
			expect(deletedField?.cliShortFlag).toBe('-d');
		});
	});
});
