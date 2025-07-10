/**
 * Clips long content for display in tables
 * @param value - The value to potentially clip
 * @param fieldName - The field name to determine if it should be clipped
 * @param maxLength - Maximum length before clipping (default: 50)
 * @returns Clipped string with ellipsis if needed
 */
export function clipContent(value: string, fieldName: string, maxLength: number = 50): string {
	if (!value || typeof value !== 'string') {
		return value;
	}

	// Fields that typically contain long content and should be clipped
	const longContentFields = [
		'html',
		'text',
		'to',
		'cc',
		'bcc',
		'replyTo',
		'reply_to',
		'content',
		'message',
		'body',
		'description',
		'emails',
	];

	// Check if this field should be clipped
	const shouldClip = longContentFields.some((field) => fieldName.toLowerCase().includes(field.toLowerCase()));

	if (!shouldClip || value.length <= maxLength) {
		return value;
	}

	// Clip the content and add ellipsis
	return `${value.substring(0, maxLength - 3)}...`;
}
