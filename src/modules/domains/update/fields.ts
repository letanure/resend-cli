import type { CliField, FormField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'id',
		label: 'Domain ID',
		placeholder: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
		helpText: 'The ID of the domain to update',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
	{
		name: 'click-tracking',
		label: 'Click Tracking',
		placeholder: 'yes',
		helpText: 'Track clicks within the body of each HTML email (yes/no)',
		cliFlag: '--click-tracking',
		cliShortFlag: '-c',
	},
	{
		name: 'open-tracking',
		label: 'Open Tracking',
		placeholder: 'yes',
		helpText: 'Track the open rate of each email (yes/no)',
		cliFlag: '--open-tracking',
		cliShortFlag: '-o',
	},
	{
		name: 'tls',
		label: 'TLS Configuration',
		placeholder: 'opportunistic',
		helpText: 'TLS configuration: "opportunistic" or "enforced"',
		cliFlag: '--tls',
		cliShortFlag: '-t',
	},
];

export const updateDomainFields: Array<FormField> = [
	{
		name: 'domainId',
		label: 'Domain ID',
		type: 'text',
		placeholder: 'b8617ad3-b712-41d9-81a0-f7c3d879314e',
		helpText: 'Enter the domain ID to update',
	},
	{
		name: 'clickTracking',
		label: 'Click Tracking',
		type: 'select',
		placeholder: 'Select option',
		helpText: 'Track clicks within the body of each HTML email',
		options: [
			{ value: 'true', label: 'Yes' },
			{ value: 'false', label: 'No' },
		],
	},
	{
		name: 'openTracking',
		label: 'Open Tracking',
		type: 'select',
		placeholder: 'Select option',
		helpText: 'Track the open rate of each email',
		options: [
			{ value: 'true', label: 'Yes' },
			{ value: 'false', label: 'No' },
		],
	},
	{
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
	},
];

// Display fields for the update result
export const displayFields: Array<CliField> = [
	{
		name: 'id',
		label: 'ID',
		placeholder: '',
		helpText: '',
		cliFlag: '--id',
		cliShortFlag: '-i',
	},
	{
		name: 'object',
		label: 'Object',
		placeholder: '',
		helpText: '',
		cliFlag: '--object',
		cliShortFlag: '-o',
	},
];
