import { describe, expect, it } from 'vitest';
import { displayFields, fields, verifyDomainFields } from '../fields.js';

describe('domains verify fields configuration', () => {
	it('should have CLI fields configured', () => {
		expect(fields).toHaveLength(1);
		expect(fields[0]).toEqual({
			name: 'id',
			label: 'Domain ID',
			placeholder: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			helpText: 'The ID of the domain to verify',
			cliFlag: '--id',
			cliShortFlag: '-i',
		});
	});

	it('should have form fields configured', () => {
		expect(verifyDomainFields).toHaveLength(1);
		expect(verifyDomainFields[0]).toEqual({
			name: 'domainId',
			label: 'Domain ID',
			type: 'text',
			placeholder: 'd91cd9bd-1176-453e-8fc1-35364d380206',
			helpText: 'Enter the domain ID to verify',
		});
	});

	it('should have display fields configured', () => {
		expect(displayFields).toHaveLength(2);
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
	});

	it('should maintain consistency between CLI and form field names', () => {
		// CLI fields use 'id' but form fields use 'domainId' to match schema
		expect(fields[0]?.name).toBe('id');
		expect(verifyDomainFields[0]?.name).toBe('domainId');
	});

	it('should have proper field types', () => {
		const formField = verifyDomainFields[0];
		expect(formField?.type).toBe('text');
	});

	it('should have consistent placeholders', () => {
		const cliField = fields[0];
		const formField = verifyDomainFields[0];
		expect(cliField?.placeholder).toBe(formField?.placeholder);
	});
});
