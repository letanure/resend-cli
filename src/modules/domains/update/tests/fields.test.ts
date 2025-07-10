import { describe, expect, it } from 'vitest';
import { displayFields, fields, updateDomainFields } from '../fields.js';

describe('domains update fields configuration', () => {
	it('should have CLI fields configured', () => {
		expect(fields).toHaveLength(4);
		expect(fields[0]).toEqual({
			name: 'domainId',
			label: 'Domain ID',
			placeholder: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			helpText: 'The ID of the domain to update',
			cliFlag: 'id',
			cliShortFlag: 'i',
		});
		expect(fields[1]).toEqual({
			name: 'clickTracking',
			label: 'Click Tracking',
			placeholder: 'yes',
			helpText: 'Track clicks within the body of each HTML email (yes/no)',
			cliFlag: 'click-tracking',
			cliShortFlag: 'c',
		});
		expect(fields[2]).toEqual({
			name: 'openTracking',
			label: 'Open Tracking',
			placeholder: 'yes',
			helpText: 'Track the open rate of each email (yes/no)',
			cliFlag: 'open-tracking',
			cliShortFlag: 'o',
		});
		expect(fields[3]).toEqual({
			name: 'tls',
			label: 'TLS Configuration',
			placeholder: 'opportunistic',
			helpText: 'TLS configuration: "opportunistic" or "enforced"',
			cliFlag: 'tls',
			cliShortFlag: 't',
		});
	});

	it('should have form fields configured', () => {
		expect(updateDomainFields).toHaveLength(4);
		expect(updateDomainFields[0]).toEqual({
			name: 'domainId',
			label: 'Domain ID',
			type: 'input-with-selector',
			placeholder: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
			helpText: 'Enter the domain ID to update',
		});
		expect(updateDomainFields[1]).toEqual({
			name: 'clickTracking',
			label: 'Click Tracking',
			type: 'select',
			placeholder: 'Select option',
			helpText: 'Track clicks within the body of each HTML email',
			options: [
				{ value: 'true', label: 'Yes' },
				{ value: 'false', label: 'No' },
			],
		});
		expect(updateDomainFields[2]).toEqual({
			name: 'openTracking',
			label: 'Open Tracking',
			type: 'select',
			placeholder: 'Select option',
			helpText: 'Track the open rate of each email',
			options: [
				{ value: 'true', label: 'Yes' },
				{ value: 'false', label: 'No' },
			],
		});
		expect(updateDomainFields[3]).toEqual({
			name: 'tls',
			label: 'TLS Configuration',
			type: 'select',
			display: 'stacked',
			placeholder: 'Select TLS mode',
			helpText: 'TLS configuration for the domain',
			options: [
				{ value: 'opportunistic', label: 'Opportunistic - Attempt secure connection, fallback to unencrypted' },
				{ value: 'enforced', label: 'Enforced - Require TLS, fail if not available' },
			],
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
		// Both CLI and form fields use camelCase to match schema
		expect(fields[0]?.name).toBe('domainId');
		expect(updateDomainFields[0]?.name).toBe('domainId');
		expect(fields[1]?.name).toBe('clickTracking');
		expect(updateDomainFields[1]?.name).toBe('clickTracking');
		expect(fields[2]?.name).toBe('openTracking');
		expect(updateDomainFields[2]?.name).toBe('openTracking');
		expect(fields[3]?.name).toBe('tls');
		expect(updateDomainFields[3]?.name).toBe('tls');
	});

	it('should have proper field types', () => {
		expect(updateDomainFields[0]?.type).toBe('input-with-selector');
		expect(updateDomainFields[1]?.type).toBe('select');
		expect(updateDomainFields[2]?.type).toBe('select');
		expect(updateDomainFields[3]?.type).toBe('select');
	});

	it('should have correct boolean select options', () => {
		const clickField = updateDomainFields[1];
		const openField = updateDomainFields[2];

		expect(clickField?.options).toEqual([
			{ value: 'true', label: 'Yes' },
			{ value: 'false', label: 'No' },
		]);
		expect(openField?.options).toEqual([
			{ value: 'true', label: 'Yes' },
			{ value: 'false', label: 'No' },
		]);
	});

	it('should have correct TLS select options', () => {
		const tlsField = updateDomainFields[3];

		expect(tlsField?.options).toEqual([
			{ value: 'opportunistic', label: 'Opportunistic - Attempt secure connection, fallback to unencrypted' },
			{ value: 'enforced', label: 'Enforced - Require TLS, fail if not available' },
		]);
	});
});
