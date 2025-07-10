import { describe, expect, it } from 'vitest';
import { createBroadcastFields, displayFields, fields } from '../fields.js';

describe('broadcasts create fields configuration', () => {
	it('should have CLI fields configured', () => {
		expect(fields).toHaveLength(7);

		expect(fields[0]).toEqual({
			name: 'audience-id',
			label: 'Audience ID',
			placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			helpText: 'The ID of the audience you want to send to',
			cliFlag: '--audience-id',
			cliShortFlag: '-a',
		});

		expect(fields[1]).toEqual({
			name: 'from',
			label: 'From',
			placeholder: 'Your Name <sender@domain.com>',
			helpText: 'Sender email address with optional name',
			cliFlag: '--from',
			cliShortFlag: '-f',
		});

		expect(fields[2]).toEqual({
			name: 'subject',
			label: 'Subject',
			placeholder: 'Enter broadcast subject',
			helpText: 'Email subject line',
			cliFlag: '--subject',
			cliShortFlag: '-s',
		});
	});

	it('should have form fields configured', () => {
		expect(createBroadcastFields).toHaveLength(7);

		expect(createBroadcastFields[0]).toEqual({
			name: 'audienceId',
			label: 'Audience ID',
			type: 'input-with-selector',
			placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			helpText: 'Enter the audience ID to send the broadcast to',
		});

		expect(createBroadcastFields[4]).toEqual({
			name: 'html',
			label: 'HTML Content',
			type: 'textarea',
			placeholder: '<p>Your HTML content here</p>',
			helpText: 'HTML version of the message',
		});

		expect(createBroadcastFields[5]).toEqual({
			name: 'text',
			label: 'Text Content',
			type: 'textarea',
			placeholder: 'Your plain text message here...',
			helpText: 'Plain text version of the message',
		});
	});

	it('should have display fields configured', () => {
		expect(displayFields).toHaveLength(1);
		expect(displayFields[0]).toEqual({
			name: 'id',
			label: 'ID',
			placeholder: '',
			helpText: '',
			cliFlag: '--id',
			cliShortFlag: '-i',
		});
	});

	it('should maintain consistency between CLI and form field names', () => {
		// Map CLI field names to form field names
		const cliToFormMapping: Record<string, string> = {
			'audience-id': 'audienceId',
			from: 'from',
			subject: 'subject',
			'reply-to': 'replyTo',
			html: 'html',
			text: 'text',
			name: 'name',
		};

		fields.forEach((cliField) => {
			const expectedFormFieldName = cliToFormMapping[cliField.name];
			const formField = createBroadcastFields.find((f) => f.name === expectedFormFieldName);
			expect(formField).toBeDefined();
			expect(formField?.label).toBe(cliField.label);
		});
	});

	it('should have proper field types', () => {
		const textFields = createBroadcastFields.filter((f) => f.type === 'text');
		const textareaFields = createBroadcastFields.filter((f) => f.type === 'textarea');

		expect(textFields).toHaveLength(4); // from, subject, replyTo, name
		expect(textareaFields).toHaveLength(2); // html, text
	});

	it('should have all required fields for broadcast creation', () => {
		const requiredFields = ['audienceId', 'from', 'subject'];
		const fieldNames = createBroadcastFields.map((f) => f.name);

		requiredFields.forEach((fieldName) => {
			expect(fieldNames).toContain(fieldName);
		});
	});

	it('should have content fields (html/text)', () => {
		const contentFields = createBroadcastFields.filter((f) => f.name === 'html' || f.name === 'text');

		expect(contentFields).toHaveLength(2);
		contentFields.forEach((field) => {
			expect(field.type).toBe('textarea');
		});
	});
});
