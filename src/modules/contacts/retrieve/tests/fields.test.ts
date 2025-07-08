import { describe, expect, it } from 'vitest';
import { displayFields, fields } from '../fields.js';

describe('Contact Retrieve Fields', () => {
	it('should have correct number of input fields', () => {
		expect(fields).toHaveLength(3);
	});

	it('should have audienceId field as first field', () => {
		const audienceIdField = fields[0];
		expect(audienceIdField).toBeDefined();
		expect(audienceIdField?.name).toBe('audienceId');
		expect(audienceIdField?.cliFlag).toBe('audience-id');
		expect(audienceIdField?.cliShortFlag).toBe('a');
	});

	it('should have id field as second field', () => {
		const idField = fields[1];
		expect(idField).toBeDefined();
		expect(idField?.name).toBe('id');
		expect(idField?.cliFlag).toBe('id');
		expect(idField?.cliShortFlag).toBe('i');
	});

	it('should have email field as third field', () => {
		const emailField = fields[2];
		expect(emailField).toBeDefined();
		expect(emailField?.name).toBe('email');
		expect(emailField?.cliFlag).toBe('email');
		expect(emailField?.cliShortFlag).toBe('e');
	});

	it('should have all required properties for each input field', () => {
		for (const field of fields) {
			expect(field.name).toBeDefined();
			expect(field.label).toBeDefined();
			expect(field.placeholder).toBeDefined();
			expect(field.helpText).toBeDefined();
			expect(field.cliFlag).toBeDefined();
			expect(field.cliShortFlag).toBeDefined();
		}
	});

	it('should have correct number of display fields', () => {
		expect(displayFields).toHaveLength(7);
	});

	it('should have all expected display fields', () => {
		const expectedFieldNames = ['id', 'object', 'email', 'firstName', 'lastName', 'created_at', 'unsubscribed'];

		for (const expectedName of expectedFieldNames) {
			const field = displayFields.find((f) => f.name === expectedName);
			expect(field).toBeDefined();
			expect(field?.name).toBe(expectedName);
		}
	});

	it('should have all required properties for each display field', () => {
		for (const field of displayFields) {
			expect(field.name).toBeDefined();
			expect(field.label).toBeDefined();
			expect(field.placeholder).toBeDefined();
			expect(field.helpText).toBeDefined();
			expect(field.cliFlag).toBeDefined();
			expect(field.cliShortFlag).toBeDefined();
		}
	});

	it('should have correct field labels', () => {
		expect(fields[0]?.label).toBe('Audience ID');
		expect(fields[1]?.label).toBe('Contact ID');
		expect(fields[2]?.label).toBe('Email');
	});

	it('should have helpful placeholders', () => {
		expect(fields[0]?.placeholder).toContain('78261eea-8f8b-4381-83c6-79fa7120f1cf');
		expect(fields[1]?.placeholder).toContain('479e3145-dd38-476b-932c-529ceb705947');
		expect(fields[2]?.placeholder).toBe('user@example.com');
	});

	it('should have informative help text', () => {
		expect(fields[0]?.helpText).toContain('audience');
		expect(fields[1]?.helpText).toContain('contact');
		expect(fields[2]?.helpText).toContain('email');
	});
});
