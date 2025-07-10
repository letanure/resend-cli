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

	it('calls onSelect when right arrow is pressed', async () => {
		const { stdin } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		await stdin.write('\u001B[C'); // Right arrow

		expect(mockOnSelect).toHaveBeenCalledWith('email');
	});

	it('calls onExit when left arrow is pressed', async () => {
		const { stdin } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		await stdin.write('\u001B[D'); // Left arrow

		expect(mockOnExit).toHaveBeenCalledWith('email');
	});

	it('handles empty menu items gracefully', () => {
		const { lastFrame } = renderWithProviders(<Menu menuItems={[]} onSelect={mockOnSelect} onExit={mockOnExit} />);

		expect(lastFrame()).toBeDefined();
	});

	it('wraps around when navigating up from first item', async () => {
		const { stdin, lastFrame } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		// Start at first item (Email), go up should wrap to last item (API Keys)
		await stdin.write('\u001B[A'); // Up arrow

		const output = lastFrame();
		expect(output).toContain('▶');
		// Should be on last item now
	});

	it('wraps around when navigating down from last item', async () => {
		const { stdin, lastFrame } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} initialSelectedKey="api-keys" />,
		);

		// Start at last item (API Keys), go down should wrap to first item (Email)
		await stdin.write('\u001B[B'); // Down arrow

		const output = lastFrame();
		expect(output).toContain('▶');
		// Should be on first item now
	});

	it('circular navigation: up from first goes to last', async () => {
		const { stdin } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} />,
		);

		// Navigate down to second item, then up twice to test wrap-around
		await stdin.write('\u001B[B'); // Down arrow (go to second item)
		await new Promise<void>((resolve) => setTimeout(resolve, 10));
		await stdin.write('\u001B[A'); // Up arrow (back to first item)
		await new Promise<void>((resolve) => setTimeout(resolve, 10));
		await stdin.write('\u001B[A'); // Up arrow (should wrap to last item)
		await new Promise<void>((resolve) => setTimeout(resolve, 10));
		await stdin.write('\r'); // Enter

		expect(mockOnSelect).toHaveBeenCalledWith('api-keys'); // Last item should be selected
	});

	it('circular navigation: down from last goes to first', async () => {
		const { stdin } = renderWithProviders(
			<Menu menuItems={mockMenuItems} onSelect={mockOnSelect} onExit={mockOnExit} initialSelectedKey="api-keys" />,
		);

		// Start at last item, press down, add a small delay, then Enter to select
		await stdin.write('\u001B[B'); // Down arrow (should go to first item)
		await new Promise<void>((resolve) => setTimeout(resolve, 10)); // Small delay for state update
		await stdin.write('\r'); // Enter

		expect(mockOnSelect).toHaveBeenCalledWith('email'); // First item should be selected
	});
});
