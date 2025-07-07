import { describe, expect, it } from 'vitest';
import { fields } from './fields.js';

describe('Contact Create Fields', () => {
	it('should have correct number of fields', () => {
		expect(fields).toHaveLength(5);
	});

	it('should have email field as first field', () => {
		const emailField = fields[0];
		expect(emailField).toBeDefined();
		expect(emailField?.name).toBe('email');
		expect(emailField?.cliFlag).toBe('--email');
		expect(emailField?.cliShortFlag).toBe('-e');
	});

	it('should have audience_id field as second field', () => {
		const audienceIdField = fields[1];
		expect(audienceIdField).toBeDefined();
		expect(audienceIdField?.name).toBe('audience_id');
		expect(audienceIdField?.cliFlag).toBe('--audience-id');
		expect(audienceIdField?.cliShortFlag).toBe('-a');
	});

	it('should have unsubscribed field as last field', () => {
		const unsubscribedField = fields[4];
		expect(unsubscribedField).toBeDefined();
		expect(unsubscribedField?.name).toBe('unsubscribed');
		expect(unsubscribedField?.type).toBe('radio');
		expect(unsubscribedField?.options).toBeDefined();
		expect(unsubscribedField?.options).toHaveLength(2);
		expect(unsubscribedField?.cliFlag).toBe('--unsubscribed');
		expect(unsubscribedField?.cliShortFlag).toBe('-u');
	});

	it('should have radio field options configured correctly', () => {
		const unsubscribedField = fields[4];
		expect(unsubscribedField?.options?.[0]).toEqual({
			value: false,
			label: 'Subscribed',
			color: 'green',
			icon: '✓',
		});
		expect(unsubscribedField?.options?.[1]).toEqual({
			value: true,
			label: 'Unsubscribed',
			color: 'red',
			icon: '✗',
		});
	});

	it('should have all required properties for each field', () => {
		for (const field of fields) {
			expect(field.name).toBeDefined();
			expect(field.label).toBeDefined();
			expect(field.placeholder).toBeDefined();
			expect(field.helpText).toBeDefined();
			expect(field.cliFlag).toBeDefined();
			expect(field.cliShortFlag).toBeDefined();
		}
	});
});
