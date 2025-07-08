import { describe, expect, it } from 'vitest';
import { displayFields, fields, listBroadcastsFields } from '../fields.js';

describe('list broadcasts fields', () => {
	describe('CLI fields', () => {
		it('should have no input fields', () => {
			expect(fields).toHaveLength(0);
		});
	});

	describe('TUI form fields', () => {
		it('should have no input fields', () => {
			expect(listBroadcastsFields).toHaveLength(0);
		});
	});

	describe('Display fields', () => {
		it('should have correct number of fields', () => {
			expect(displayFields).toHaveLength(6);
		});

		it('should have id field', () => {
			const idField = displayFields.find((field) => field.name === 'id');
			expect(idField).toBeDefined();
			expect(idField?.label).toBe('ID');
			expect(idField?.cliFlag).toBe('--id');
			expect(idField?.cliShortFlag).toBe('-i');
		});

		it('should have audience_id field', () => {
			const audienceIdField = displayFields.find((field) => field.name === 'audience_id');
			expect(audienceIdField).toBeDefined();
			expect(audienceIdField?.label).toBe('Audience ID');
			expect(audienceIdField?.cliFlag).toBe('--audience-id');
			expect(audienceIdField?.cliShortFlag).toBe('-a');
		});

		it('should have status field', () => {
			const statusField = displayFields.find((field) => field.name === 'status');
			expect(statusField).toBeDefined();
			expect(statusField?.label).toBe('Status');
			expect(statusField?.cliFlag).toBe('--status');
			expect(statusField?.cliShortFlag).toBe('-s');
		});

		it('should have created_at field', () => {
			const createdAtField = displayFields.find((field) => field.name === 'created_at');
			expect(createdAtField).toBeDefined();
			expect(createdAtField?.label).toBe('Created At');
			expect(createdAtField?.cliFlag).toBe('--created-at');
			expect(createdAtField?.cliShortFlag).toBe('-c');
		});

		it('should have scheduled_at field', () => {
			const scheduledAtField = displayFields.find((field) => field.name === 'scheduled_at');
			expect(scheduledAtField).toBeDefined();
			expect(scheduledAtField?.label).toBe('Scheduled At');
			expect(scheduledAtField?.cliFlag).toBe('--scheduled-at');
			expect(scheduledAtField?.cliShortFlag).toBe('-h');
		});

		it('should have sent_at field', () => {
			const sentAtField = displayFields.find((field) => field.name === 'sent_at');
			expect(sentAtField).toBeDefined();
			expect(sentAtField?.label).toBe('Sent At');
			expect(sentAtField?.cliFlag).toBe('--sent-at');
			expect(sentAtField?.cliShortFlag).toBe('-t');
		});
	});
});
