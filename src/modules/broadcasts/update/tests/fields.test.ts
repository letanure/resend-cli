import { describe, expect, it } from 'vitest';
import { displayFields, fields, updateBroadcastFields } from '../fields.js';

describe('broadcasts update fields configuration', () => {
	it('should have CLI fields configured', () => {
		expect(fields).toHaveLength(8);

		expect(fields[0]).toEqual({
			name: 'broadcast-id',
			label: 'Broadcast ID',
			placeholder: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			helpText: 'The ID of the broadcast you want to update',
			cliFlag: '--broadcast-id',
			cliShortFlag: '-b',
		});

		expect(fields[1]).toEqual({
			name: 'audience-id',
			label: 'Audience ID',
			placeholder: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
			helpText: 'The ID of the audience you want to send to',
			cliFlag: '--audience-id',
			cliShortFlag: '-a',
		});

		expect(fields[2]).toEqual({
			name: 'from',
			label: 'From',
			placeholder: 'Your Name <sender@domain.com>',
			helpText: 'Sender email address with optional name',
			cliFlag: '--from',
			cliShortFlag: '-f',
		});
	});

	it('should have form fields configured', () => {
		expect(updateBroadcastFields).toHaveLength(8);

		expect(updateBroadcastFields[0]).toEqual({
			name: 'broadcastId',
			label: 'Broadcast ID',
			type: 'text',
			placeholder: '49a3999c-0ce1-4ea6-ab68-afcd6dc2e794',
			helpText: 'Enter the broadcast ID to update',
		});

		expect(updateBroadcastFields[5]).toEqual({
			name: 'html',
			label: 'HTML Content',
			type: 'textarea',
			placeholder: '<p>Your HTML content here</p>',
			helpText: 'HTML version of the message (optional)',
		});

		expect(updateBroadcastFields[6]).toEqual({
			name: 'text',
			label: 'Text Content',
			type: 'textarea',
			placeholder: 'Your plain text message here...',
			helpText: 'Plain text version of the message (optional)',
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
			'broadcast-id': 'broadcastId',
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
			const formField = updateBroadcastFields.find((f) => f.name === expectedFormFieldName);
			expect(formField).toBeDefined();
			expect(formField?.label).toBe(cliField.label);
		});
	});

	it('should have proper field types', () => {
		const textFields = updateBroadcastFields.filter((f) => f.type === 'text');
		const textareaFields = updateBroadcastFields.filter((f) => f.type === 'textarea');

		expect(textFields).toHaveLength(6); // broadcastId, audienceId, from, subject, replyTo, name
		expect(textareaFields).toHaveLength(2); // html, text
	});

	it('should have all required fields for broadcast update', () => {
		const requiredFields = ['broadcastId'];
		const optionalFields = ['audienceId', 'from', 'subject', 'replyTo', 'html', 'text', 'name'];
		const allFields = [...requiredFields, ...optionalFields];
		const fieldNames = updateBroadcastFields.map((f) => f.name);

		allFields.forEach((fieldName) => {
			expect(fieldNames).toContain(fieldName);
		});
	});

	it('should have content fields (html/text)', () => {
		const contentFields = updateBroadcastFields.filter((f) => f.name === 'html' || f.name === 'text');

		expect(contentFields).toHaveLength(2);
		contentFields.forEach((field) => {
			expect(field.type).toBe('textarea');
		});
	});

	it('should have proper CLI flags', () => {
		fields.forEach((field) => {
			expect(field.cliFlag.startsWith('--')).toBe(true);
			expect(field.cliShortFlag.startsWith('-')).toBe(true);
			expect(field.cliShortFlag).toHaveLength(2);
		});
	});

	it('should have unique CLI short flags', () => {
		const shortFlags = fields.map((f) => f.cliShortFlag);
		const uniqueFlags = new Set(shortFlags);
		expect(uniqueFlags.size).toBe(shortFlags.length);
	});
});
