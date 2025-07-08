import { describe, expect, it } from 'vitest';
import { displayFields, fields } from '../fields.js';

describe('API Keys List Fields', () => {
	it('should have no input fields', () => {
		expect(fields).toHaveLength(0);
	});

	it('should have correct display fields', () => {
		expect(displayFields).toHaveLength(3);
	});

	it('should have API Key ID field', () => {
		const idField = displayFields[0];
		expect(idField).toBeDefined();
		expect(idField?.name).toBe('id');
		expect(idField?.label).toBe('API Key ID');
	});

	it('should have name field', () => {
		const nameField = displayFields[1];
		expect(nameField).toBeDefined();
		expect(nameField?.name).toBe('name');
		expect(nameField?.label).toBe('Name');
	});

	it('should have created_at field', () => {
		const createdAtField = displayFields[2];
		expect(createdAtField).toBeDefined();
		expect(createdAtField?.name).toBe('created_at');
		expect(createdAtField?.label).toBe('Created At');
	});
});
