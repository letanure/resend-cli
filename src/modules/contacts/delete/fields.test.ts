import { describe, expect, it } from 'vitest';
import { fields } from './fields.js';

describe('Delete Contact Fields', () => {
	it('exports fields array', () => {
		expect(fields).toBeDefined();
		expect(Array.isArray(fields)).toBe(true);
	});

	it('includes audience_id field', () => {
		const audienceIdField = fields.find((field) => field.name === 'audience_id');
		expect(audienceIdField).toBeDefined();
		expect(audienceIdField?.cliFlag).toBe('audience-id');
		expect(audienceIdField?.cliShortFlag).toBe('a');
	});

	it('includes id field', () => {
		const idField = fields.find((field) => field.name === 'id');
		expect(idField).toBeDefined();
		expect(idField?.cliFlag).toBe('id');
		expect(idField?.cliShortFlag).toBe('i');
	});

	it('includes email field', () => {
		const emailField = fields.find((field) => field.name === 'email');
		expect(emailField).toBeDefined();
		expect(emailField?.cliFlag).toBe('email');
		expect(emailField?.cliShortFlag).toBe('e');
	});

	it('has correct number of fields', () => {
		expect(fields).toHaveLength(3);
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
		expect(fieldNames).toEqual(['audience_id', 'id', 'email']);
	});

	it('all fields have proper labels and help text', () => {
		for (const field of fields) {
			expect(field.label).toBeDefined();
			expect(field.helpText).toBeDefined();
			expect(field.placeholder).toBeDefined();
		}
	});

	it('audience_id field has correct configuration', () => {
		const audienceIdField = fields.find((field) => field.name === 'audience_id');
		expect(audienceIdField?.label).toBe('Audience ID');
		expect(audienceIdField?.helpText).toBe('The unique identifier of the audience containing the contact');
	});

	it('id field has correct configuration', () => {
		const idField = fields.find((field) => field.name === 'id');
		expect(idField?.label).toBe('Contact ID');
		expect(idField?.helpText).toBe('The unique identifier of the contact to delete');
	});

	it('email field has correct configuration', () => {
		const emailField = fields.find((field) => field.name === 'email');
		expect(emailField?.label).toBe('Contact Email');
		expect(emailField?.helpText).toBe('The email address of the contact to delete');
	});
});
