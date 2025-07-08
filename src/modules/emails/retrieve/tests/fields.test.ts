import { describe, expect, it } from 'vitest';
import { fields } from '../fields.js';

describe('retrieve fields', () => {
	it('should export an array of CliField objects', () => {
		expect(Array.isArray(fields)).toBe(true);
		expect(fields.length).toBeGreaterThan(0);
	});

	it('should have the required structure for each field', () => {
		for (const field of fields) {
			expect(field).toHaveProperty('name');
			expect(field).toHaveProperty('label');
			expect(field).toHaveProperty('placeholder');
			expect(field).toHaveProperty('helpText');
			expect(field).toHaveProperty('cliFlag');
			expect(field).toHaveProperty('cliShortFlag');

			expect(typeof field.name).toBe('string');
			expect(typeof field.label).toBe('string');
			expect(typeof field.placeholder).toBe('string');
			expect(typeof field.helpText).toBe('string');
			expect(typeof field.cliFlag).toBe('string');
			expect(typeof field.cliShortFlag).toBe('string');
		}
	});

	it('should have unique field names', () => {
		const names = fields.map((field) => field.name);
		const uniqueNames = new Set(names);
		expect(uniqueNames.size).toBe(names.length);
	});

	it('should have unique CLI flags', () => {
		const cliFlags = fields.map((field) => field.cliFlag);
		const uniqueCliFlags = new Set(cliFlags);
		expect(uniqueCliFlags.size).toBe(cliFlags.length);
	});

	it('should have unique CLI short flags', () => {
		const shortFlags = fields.map((field) => field.cliShortFlag);
		const uniqueShortFlags = new Set(shortFlags);
		expect(uniqueShortFlags.size).toBe(shortFlags.length);
	});

	it('should include the id field for email retrieval', () => {
		const idField = fields.find((field) => field.name === 'id');
		expect(idField).toBeDefined();
		expect(idField?.label).toBe('Email ID');
		expect(idField?.cliFlag).toBe('id');
		expect(idField?.cliShortFlag).toBe('i');
	});
});
