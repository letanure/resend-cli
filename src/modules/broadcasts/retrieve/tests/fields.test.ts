import { describe, expect, it } from 'vitest';
import { displayFields, fields, retrieveBroadcastFields } from '../fields.js';

describe('broadcasts retrieve fields configuration', () => {
	it('should have CLI fields configured', () => {
		expect(fields).toHaveLength(1);

		expect(fields[0]).toEqual({
			name: 'broadcast-id',
			label: 'Broadcast ID',
			placeholder: '559ac32e-9ef5-46fb-82a1-b76b840c0f7b',
			helpText: 'The broadcast ID to retrieve',
			cliFlag: '--broadcast-id',
			cliShortFlag: '-b',
		});
	});

	it('should have form fields configured', () => {
		expect(retrieveBroadcastFields).toHaveLength(1);

		const field = retrieveBroadcastFields[0];
		expect(field).toBeDefined();
		expect(field?.name).toBe('broadcastId');
		expect(field?.label).toBe('Broadcast ID');
		expect(field?.type).toBe('input-with-selector');
		expect(field?.placeholder).toBe('559ac32e-9ef5-46fb-82a1-b76b840c0f7b');
		expect(field?.helpText).toBe('Enter the broadcast ID or select from list');
	});

	it('should have display fields configured', () => {
		expect(displayFields).toHaveLength(7);

		expect(displayFields[0]).toEqual({
			name: 'id',
			label: 'ID',
			placeholder: '',
			helpText: '',
			cliFlag: '--id',
			cliShortFlag: '-i',
		});

		expect(displayFields[1]).toEqual({
			name: 'name',
			label: 'Name',
			placeholder: '',
			helpText: '',
			cliFlag: '--name',
			cliShortFlag: '-n',
		});

		expect(displayFields[5]).toEqual({
			name: 'status',
			label: 'Status',
			placeholder: '',
			helpText: '',
			cliFlag: '--status',
			cliShortFlag: '-t',
		});
	});

	it('should maintain consistency between CLI and form field names', () => {
		// Map CLI field names to form field names
		const cliToFormMapping: Record<string, string> = {
			'broadcast-id': 'broadcastId',
		};

		fields.forEach((cliField) => {
			const expectedFormFieldName = cliToFormMapping[cliField.name];
			const formField = retrieveBroadcastFields.find((f) => f.name === expectedFormFieldName);
			expect(formField).toBeDefined();
			expect(formField?.label).toBe(cliField.label);
		});
	});

	it('should have proper field types', () => {
		const inputWithSelectorFields = retrieveBroadcastFields.filter((f) => f.type === 'input-with-selector');

		expect(inputWithSelectorFields).toHaveLength(1); // broadcastId
		expect(inputWithSelectorFields[0]?.name).toBe('broadcastId');
	});

	it('should have all required fields for broadcast retrieval', () => {
		const requiredFields = ['broadcastId'];
		const fieldNames = retrieveBroadcastFields.map((f) => f.name);

		requiredFields.forEach((fieldName) => {
			expect(fieldNames).toContain(fieldName);
		});
	});

	it('should have display fields for broadcast details', () => {
		const expectedDisplayFields = ['id', 'name', 'audienceId', 'from', 'subject', 'status', 'created_at'];
		const displayFieldNames = displayFields.map((f) => f.name);

		expectedDisplayFields.forEach((fieldName) => {
			expect(displayFieldNames).toContain(fieldName);
		});
	});

	it('should have proper CLI flags for display fields', () => {
		displayFields.forEach((field) => {
			expect(field.cliFlag.startsWith('--')).toBe(true);
			expect(field.cliShortFlag.startsWith('-')).toBe(true);
			expect(field.cliShortFlag).toHaveLength(2);
		});
	});
});
