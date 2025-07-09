import type { CliField } from '@/types/index.js';

export const fields: Array<CliField> = [
	{
		name: 'name',
		label: 'Domain Name',
		placeholder: 'Enter the domain name (e.g., example.com)',
		helpText: 'The name of the domain you want to create',
		cliFlag: 'name',
		cliShortFlag: 'n',
	},
	{
		name: 'region',
		label: 'Region',
		placeholder: 'Select region (default: us-east-1)',
		helpText: 'The region where emails will be sent from',
		cliFlag: 'region',
		cliShortFlag: 'r',
		type: 'select',
		display: 'stacked',
		options: [
			{ label: 'US East 1 (us-east-1)', value: 'us-east-1' },
			{ label: 'EU West 1 (eu-west-1)', value: 'eu-west-1' },
			{ label: 'SA East 1 (sa-east-1)', value: 'sa-east-1' },
			{ label: 'AP Northeast 1 (ap-northeast-1)', value: 'ap-northeast-1' },
		],
	},
	{
		name: 'custom_return_path',
		label: 'Custom Return Path',
		placeholder: 'Enter custom return path (default: send)',
		helpText: 'Subdomain for the Return-Path address (used for SPF, DMARC, and bounces)',
		cliFlag: 'custom-return-path',
		cliShortFlag: 'c',
	},
];
