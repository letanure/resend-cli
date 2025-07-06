import { vi } from 'vitest';

// Mock RESEND_API_KEY for all tests
vi.stubEnv('RESEND_API_KEY', 'test-api-key');

// Mock the send command that EmailForm uses
vi.mock('./commands/send.js', () => ({
	sendCommand: vi.fn(),
}));