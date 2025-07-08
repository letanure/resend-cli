import { describe, expect, it } from 'vitest';
import { fields } from './fields.js';

describe('Delete API Key Fields', () => {
	it('should have correct field structure', () => {
		expect(fields).toHaveLength(1);

		const apiKeyIdField = fields[0];
		expect(apiKeyIdField).toBeDefined();
		expect(apiKeyIdField?.name).toBe('api_key_id');
		expect(apiKeyIdField?.label).toBe('API Key ID');
		expect(apiKeyIdField?.cliFlag).toBe('--api-key-id');
		expect(apiKeyIdField?.cliShortFlag).toBe('-i');
	});

	it('should have all required properties', () => {
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
