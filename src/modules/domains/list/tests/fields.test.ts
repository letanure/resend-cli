import { describe, expect, it } from 'vitest';
import { displayFields, fields } from '../fields.js';

describe('fields', () => {
	it('should be an empty array for input fields', () => {
		expect(fields).toEqual([]);
		expect(Array.isArray(fields)).toBe(true);
	});
});

describe('displayFields', () => {
	it('should have the correct number of display fields', () => {
		expect(displayFields).toHaveLength(5);
	});

	it('should contain required properties for each field', () => {
		displayFields.forEach((field) => {
			expect(field).toHaveProperty('name');
			expect(field).toHaveProperty('label');
			expect(field).toHaveProperty('placeholder');
			expect(field).toHaveProperty('helpText');
			expect(field).toHaveProperty('cliFlag');
			expect(field).toHaveProperty('cliShortFlag');
		});
	});

	it('should have expected field names', () => {
		const fieldNames = displayFields.map((field) => field.name);
		expect(fieldNames).toEqual(['id', 'name', 'status', 'region', 'created_at']);
	});

	it('should have appropriate labels', () => {
		const labels = displayFields.map((field) => field.label);
		expect(labels).toEqual(['ID', 'Domain', 'Status', 'Region', 'Created']);
	});

	it('should have unique CLI flags', () => {
		const cliFlags = displayFields.map((field) => field.cliFlag);
		const uniqueFlags = new Set(cliFlags);
		expect(uniqueFlags.size).toBe(cliFlags.length);
	});

	it('should have unique short CLI flags', () => {
		const shortFlags = displayFields.map((field) => field.cliShortFlag);
		const uniqueShortFlags = new Set(shortFlags);
		expect(uniqueShortFlags.size).toBe(shortFlags.length);
	});

	it('should have empty placeholders and help text for display fields', () => {
		displayFields.forEach((field) => {
			expect(field.placeholder).toBe('');
			expect(field.helpText).toBe('');
		});
	});
});
