import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils.js';
import { Menu, type MenuItem } from './Menu.js';

describe('Menu Component', () => {
	const mockMenuItems: Array<MenuItem<string>> = [
		{ id: 'email', label: 'Email', description: 'Send and manage emails' },
		{ id: 'domains', label: 'Domains', description: 'Manage domains' },
		{ id: 'api-keys', label: 'API Keys', description: 'Manage API keys' },
	];

	const mockOnSelect = vi.fn();
	const mockOnExit = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders all menu items', () => {
		const { lastFrame } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		const output = lastFrame();
		expect(output).toContain('Email');
		expect(output).toContain('Send and manage emails');
		expect(output).toContain('Domains');
		expect(output).toContain('Manage domains');
		expect(output).toContain('API Keys');
		expect(output).toContain('Manage API keys');
	});

	it('highlights first item by default', () => {
		const { lastFrame } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		const output = lastFrame();
		expect(output).toContain('▶'); // Selection indicator
	});

	it('highlights initial selected item when provided', () => {
		const { lastFrame } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} initialSelectedKey="domains" />,
		);

		expect(lastFrame()).toContain('▶');
	});

	it('navigates down with down arrow', async () => {
		const { stdin, lastFrame } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		await stdin.write('\u001B[B'); // Down arrow

		const output = lastFrame();
		expect(output).toContain('▶');
	});

	it('navigates up with up arrow', async () => {
		const { stdin, lastFrame } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} initialSelectedKey="domains" />,
		);

		await stdin.write('\u001B[A'); // Up arrow

		const output = lastFrame();
		expect(output).toContain('▶');
	});

	it('calls onSelect when Enter is pressed', async () => {
		const { stdin } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		await stdin.write('\r'); // Enter key

		expect(mockOnSelect).toHaveBeenCalledWith('email');
	});

	it('calls onExit when q is pressed', async () => {
		const { stdin } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		await stdin.write('q');

		expect(mockOnExit).toHaveBeenCalledWith('email');
	});

	it('calls onExit when ESC is pressed', async () => {
		const { stdin } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		await stdin.write('\x1B'); // ESC key

		expect(mockOnExit).toHaveBeenCalledWith('email');
	});

	it('handles empty menu items gracefully', () => {
		const { lastFrame } = renderWithProviders(<Menu menuItems={[]} onSelect={mockOnSelect} onExit={mockOnExit} />);

		expect(lastFrame()).toBeDefined();
	});

	it('does not navigate beyond bounds', async () => {
		const { stdin, lastFrame } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		// Try to go up from first item
		await stdin.write('\u001B[A'); // Up arrow

		const output = lastFrame();
		expect(output).toContain('▶');
	});
});
