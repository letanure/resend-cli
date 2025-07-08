import { describe, expect, it } from 'vitest';
import { fields } from '../fields.js';

describe('Email Send Fields', () => {
	it('defines all required email fields', () => {
		const fieldNames = fields.map((f) => f.name);

		// Required fields
		expect(fieldNames).toContain('from');
		expect(fieldNames).toContain('to');
		expect(fieldNames).toContain('subject');

		// Content fields (at least one required)
		expect(fieldNames).toContain('html');
		expect(fieldNames).toContain('text');
	});

	it('includes optional fields', () => {
		const fieldNames = fields.map((f) => f.name);

		expect(fieldNames).toContain('bcc');
		expect(fieldNames).toContain('cc');
		expect(fieldNames).toContain('reply_to');
		expect(fieldNames).toContain('scheduled_at');
	});

	it('has required field structure', () => {
		fields.forEach((field) => {
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
		});
	});

	it('has unique field names', () => {
		const names = fields.map((f) => f.name);
		const uniqueNames = new Set(names);
		expect(uniqueNames.size).toBe(names.length);
	});

	it('has unique short flags', () => {
		const shortFlags = fields.map((f) => f.cliShortFlag);
		const uniqueFlags = new Set(shortFlags);
		expect(uniqueFlags.size).toBe(shortFlags.length);
	});

	it('has non-empty required properties', () => {
		fields.forEach((field) => {
			expect(field.name.trim()).not.toBe('');
			expect(field.label.trim()).not.toBe('');
			expect(field.placeholder.trim()).not.toBe('');
			expect(field.helpText.trim()).not.toBe('');
			expect(field.cliFlag.trim()).not.toBe('');
			expect(field.cliShortFlag.trim()).not.toBe('');
		});
	});
});
