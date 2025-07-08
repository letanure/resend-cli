import { describe, expect, it } from 'vitest';
import { fields } from '../fields.js';

describe('Create Audience Fields', () => {
	it('exports fields array', () => {
		expect(fields).toBeDefined();
		expect(Array.isArray(fields)).toBe(true);
	});

	it('includes name field', () => {
		const nameField = fields.find((field) => field.name === 'name');
		expect(nameField).toBeDefined();
		expect(nameField?.cliFlag).toBe('name');
		expect(nameField?.cliShortFlag).toBe('n');
	});

	it('has correct number of fields', () => {
		expect(fields).toHaveLength(1);
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
		expect(fieldNames).toEqual(['name']);
	});
});
