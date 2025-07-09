/**
 * Module configuration for CLI commands and completion
 * CommonJS version for use in completion scripts
 */
const moduleConfigs = [
	{ name: 'apiKeys', description: 'Manage API keys', folder: 'api-keys' },
	{ name: 'audiences', description: 'Audience operations', folder: 'audiences' },
	{ name: 'broadcasts', description: 'Broadcast operations', folder: 'broadcasts' },
	{ name: 'contacts', description: 'Manage contacts in your audiences', folder: 'contacts' },
	{ name: 'domains', description: 'Domain operations', folder: 'domains' },
	{ name: 'email', description: 'Email operations', folder: 'emails' },
];

module.exports = { moduleConfigs };