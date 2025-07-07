import { describe, expect, it } from 'vitest';
import { displayFields, fields } from './fields.js';

describe('List Audience Fields', () => {
	it('exports fields array', () => {
		expect(fields).toBeDefined();
		expect(Array.isArray(fields)).toBe(true);
	});

	it('exports displayFields array', () => {
		expect(displayFields).toBeDefined();
		expect(Array.isArray(displayFields)).toBe(true);
	});

	it('has no input fields (list takes no parameters)', () => {
		expect(fields).toHaveLength(0);
	});

	it('has display fields for table columns', () => {
		expect(displayFields.length).toBeGreaterThan(0);

		const fieldNames = displayFields.map((field) => field.name);
		expect(fieldNames).toContain('id');
		expect(fieldNames).toContain('name');
		expect(fieldNames).toContain('created_at');
	});

	it('display fields have required properties', () => {
		for (const field of displayFields) {
			expect(field.name).toBeDefined();
			expect(field.label).toBeDefined();
			expect(typeof field.name).toBe('string');
			expect(typeof field.label).toBe('string');
		}
	});

	it('display fields match expected structure', () => {
		const fieldNames = displayFields.map((field) => field.name);
		expect(fieldNames).toEqual(['id', 'name', 'created_at']);
	});
});
