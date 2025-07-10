import { describe, expect, it } from 'vitest';
import { displayFields, fields, updateContactFields } from '../fields.js';

describe('update contact fields', () => {
	describe('CLI fields', () => {
		it('should have correct number of fields', () => {
			expect(fields).toHaveLength(6);
		});

		it('should have audience-id field', () => {
			const audienceIdField = fields.find((field) => field.name === 'audience-id');
			expect(audienceIdField).toBeDefined();
			expect(audienceIdField?.label).toBe('Audience ID');
			expect(audienceIdField?.cliFlag).toBe('--audience-id');
			expect(audienceIdField?.cliShortFlag).toBe('-a');
		});

		it('should have id field', () => {
			const idField = fields.find((field) => field.name === 'id');
			expect(idField).toBeDefined();
			expect(idField?.label).toBe('Contact ID');
			expect(idField?.cliFlag).toBe('--id');
			expect(idField?.cliShortFlag).toBe('-i');
		});

		it('should have email field', () => {
			const emailField = fields.find((field) => field.name === 'email');
			expect(emailField).toBeDefined();
			expect(emailField?.label).toBe('Email');
			expect(emailField?.cliFlag).toBe('--email');
			expect(emailField?.cliShortFlag).toBe('-e');
		});

		it('should have first-name field', () => {
			const firstNameField = fields.find((field) => field.name === 'first-name');
			expect(firstNameField).toBeDefined();
			expect(firstNameField?.label).toBe('First Name');
			expect(firstNameField?.cliFlag).toBe('--first-name');
			expect(firstNameField?.cliShortFlag).toBe('-f');
		});

		it('should have last-name field', () => {
			const lastNameField = fields.find((field) => field.name === 'last-name');
			expect(lastNameField).toBeDefined();
			expect(lastNameField?.label).toBe('Last Name');
			expect(lastNameField?.cliFlag).toBe('--last-name');
			expect(lastNameField?.cliShortFlag).toBe('-l');
		});

		it('should have unsubscribed field', () => {
			const unsubscribedField = fields.find((field) => field.name === 'unsubscribed');
			expect(unsubscribedField).toBeDefined();
			expect(unsubscribedField?.label).toBe('Unsubscribed');
			expect(unsubscribedField?.cliFlag).toBe('--unsubscribed');
			expect(unsubscribedField?.cliShortFlag).toBe('-u');
		});
	});

	describe('TUI form fields', () => {
		it('should have correct number of fields', () => {
			expect(updateContactFields).toHaveLength(6);
		});

		it('should have audienceId field', () => {
			const audienceIdField = updateContactFields.find((field) => field.name === 'audienceId');
			expect(audienceIdField).toBeDefined();
			expect(audienceIdField?.label).toBe('Audience ID');
			expect(audienceIdField?.type).toBe('input-with-selector');
		});

		it('should have id field', () => {
			const idField = updateContactFields.find((field) => field.name === 'id');
			expect(idField).toBeDefined();
			expect(idField?.label).toBe('Contact ID');
			expect(idField?.type).toBe('input-with-selector');
		});

		it('should have email field', () => {
			const emailField = updateContactFields.find((field) => field.name === 'email');
			expect(emailField).toBeDefined();
			expect(emailField?.label).toBe('Email');
			expect(emailField?.type).toBe('text');
		});

		it('should have firstName field', () => {
			const firstNameField = updateContactFields.find((field) => field.name === 'firstName');
			expect(firstNameField).toBeDefined();
			expect(firstNameField?.label).toBe('First Name');
			expect(firstNameField?.type).toBe('text');
		});

		it('should have lastName field', () => {
			const lastNameField = updateContactFields.find((field) => field.name === 'lastName');
			expect(lastNameField).toBeDefined();
			expect(lastNameField?.label).toBe('Last Name');
			expect(lastNameField?.type).toBe('text');
		});

		it('should have unsubscribed field as select', () => {
			const unsubscribedField = updateContactFields.find((field) => field.name === 'unsubscribed');
			expect(unsubscribedField).toBeDefined();
			expect(unsubscribedField?.label).toBe('Unsubscribed');
			expect(unsubscribedField?.type).toBe('select');
			expect(unsubscribedField?.options).toHaveLength(2);
			expect(unsubscribedField?.options?.[0]).toEqual({ label: 'Subscribed', value: 'false' });
			expect(unsubscribedField?.options?.[1]).toEqual({ label: 'Unsubscribed', value: 'true' });
		});
	});

	describe('Display fields', () => {
		it('should have correct number of fields', () => {
			expect(displayFields).toHaveLength(2);
		});

		it('should have object field', () => {
			const objectField = displayFields.find((field) => field.name === 'object');
			expect(objectField).toBeDefined();
			expect(objectField?.label).toBe('Object');
			expect(objectField?.cliFlag).toBe('--object');
			expect(objectField?.cliShortFlag).toBe('-o');
		});

		it('should have id field', () => {
			const idField = displayFields.find((field) => field.name === 'id');
			expect(idField).toBeDefined();
			expect(idField?.label).toBe('ID');
			expect(idField?.cliFlag).toBe('--id');
			expect(idField?.cliShortFlag).toBe('-i');
		});
	});
});
