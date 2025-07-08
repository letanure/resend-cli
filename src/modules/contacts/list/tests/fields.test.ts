import { describe, expect, it } from 'vitest';
import { displayFields, fields } from '../fields.js';

describe('Contact List Fields', () => {
	it('should have correct number of input fields', () => {
		expect(fields).toHaveLength(1);
	});

	it('should have audience_id field as the only input field', () => {
		const audienceIdField = fields[0];
		expect(audienceIdField).toBeDefined();
		expect(audienceIdField?.name).toBe('audience_id');
		expect(audienceIdField?.cliFlag).toBe('audience-id');
		expect(audienceIdField?.cliShortFlag).toBe('a');
	});

	it('should have all required properties for the input field', () => {
		const field = fields[0];
		expect(field?.name).toBeDefined();
		expect(field?.label).toBeDefined();
		expect(field?.placeholder).toBeDefined();
		expect(field?.helpText).toBeDefined();
		expect(field?.cliFlag).toBeDefined();
		expect(field?.cliShortFlag).toBeDefined();
	});

	it('should have correct field label', () => {
		expect(fields[0]?.label).toBe('Audience ID');
	});

	it('should have helpful placeholder', () => {
		expect(fields[0]?.placeholder).toContain('78261eea-8f8b-4381-83c6-79fa7120f1cf');
	});

	it('should have informative help text', () => {
		expect(fields[0]?.helpText).toContain('audience');
		expect(fields[0]?.helpText).toContain('list contacts');
	});

	it('should have correct number of display fields', () => {
		expect(displayFields).toHaveLength(6);
	});

	it('should have all expected display fields', () => {
		const expectedFieldNames = ['id', 'email', 'first_name', 'last_name', 'created_at', 'subscribed'];

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

	it('should have correct display field labels', () => {
		const fieldLabels = displayFields.map((f) => f.label);
		expect(fieldLabels).toContain('Contact ID');
		expect(fieldLabels).toContain('Email');
		expect(fieldLabels).toContain('First Name');
		expect(fieldLabels).toContain('Last Name');
		expect(fieldLabels).toContain('Created At');
		expect(fieldLabels).toContain('Subscribed');
	});

	it('should have display fields with empty placeholders and help text', () => {
		for (const field of displayFields) {
			expect(field.placeholder).toBe('');
			expect(field.helpText).toBe('');
			expect(field.cliFlag).toBe('');
			expect(field.cliShortFlag).toBe('');
		}
	});

	it('should have subscribed field instead of unsubscribed field', () => {
		const subscribedField = displayFields.find((f) => f.name === 'subscribed');
		const unsubscribedField = displayFields.find((f) => f.name === 'unsubscribed');

		expect(subscribedField).toBeDefined();
		expect(unsubscribedField).toBeUndefined();
		expect(subscribedField?.label).toBe('Subscribed');
	});
});
