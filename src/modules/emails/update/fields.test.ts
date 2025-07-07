import { describe, expect, it } from 'vitest';
import { fields } from './fields.js';

describe('Update Email Fields', () => {
	it('exports fields array', () => {
		expect(fields).toBeDefined();
		expect(Array.isArray(fields)).toBe(true);
	});

	it('includes id field', () => {
		const idField = fields.find((field) => field.name === 'id');
		expect(idField).toBeDefined();
		expect(idField?.cliFlag).toBe('id');
		expect(idField?.cliShortFlag).toBe('i');
	});

	it('includes scheduled_at field', () => {
		const scheduledAtField = fields.find((field) => field.name === 'scheduled_at');
		expect(scheduledAtField).toBeDefined();
		expect(scheduledAtField?.cliFlag).toBe('scheduled-at');
		expect(scheduledAtField?.cliShortFlag).toBe('a');
	});

	it('has correct number of fields', () => {
		expect(fields).toHaveLength(2);
	});

	it('all fields have required CLI properties', () => {
		for (const field of fields) {
			expect(field.name).toBeDefined();
			expect(field.cliFlag).toBeDefined();
			expect(field.cliShortFlag).toBeDefined();
		}
	});

	it('fields match expected structure', () => {
		const fieldNames = fields.map((field) => field.name);
		expect(fieldNames).toEqual(['id', 'scheduled_at']);
	});
});
