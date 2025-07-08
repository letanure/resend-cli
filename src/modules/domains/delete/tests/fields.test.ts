import { describe, expect, it } from 'vitest';
import { deleteDomainFields, displayFields, fields } from '../fields.js';

describe('domains delete fields configuration', () => {
	it('should have CLI fields configured', () => {
		expect(fields).toHaveLength(1);
		expect(fields[0]).toEqual({
			name: 'id',
			label: 'Domain ID',
			placeholder: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			helpText: 'The ID of the domain to delete',
			cliFlag: '--id',
			cliShortFlag: '-i',
		});
	});

	it('should have form fields configured', () => {
		expect(deleteDomainFields).toHaveLength(1);
		expect(deleteDomainFields[0]).toEqual({
			name: 'domainId',
			label: 'Domain ID',
			type: 'text',
			placeholder: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			helpText: 'Enter the domain ID to delete',
		});
	});

	it('should have display fields configured', () => {
		expect(displayFields).toHaveLength(3);
		expect(displayFields[0]).toEqual({
			name: 'id',
			label: 'ID',
			placeholder: '',
			helpText: '',
			cliFlag: '--id',
			cliShortFlag: '-i',
		});
		expect(displayFields[1]).toEqual({
			name: 'object',
			label: 'Object',
			placeholder: '',
			helpText: '',
			cliFlag: '--object',
			cliShortFlag: '-o',
		});
		expect(displayFields[2]).toEqual({
			name: 'deleted',
			label: 'Deleted',
			placeholder: '',
			helpText: '',
			cliFlag: '--deleted',
			cliShortFlag: '-d',
		});
	});

	it('should maintain consistency between CLI and form field names', () => {
		// CLI fields use 'id' but form fields use 'domainId' to match schema
		expect(fields[0]?.name).toBe('id');
		expect(deleteDomainFields[0]?.name).toBe('domainId');
	});

	it('should have proper field types', () => {
		const formField = deleteDomainFields[0];
		expect(formField?.type).toBe('text');
	});

	it('should have consistent placeholders', () => {
		const cliField = fields[0];
		const formField = deleteDomainFields[0];
		expect(cliField?.placeholder).toBe(formField?.placeholder);
	});
});
