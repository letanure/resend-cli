import { Text } from 'ink';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils.js';
import { Layout } from './layout.js';

describe('Layout Component', () => {
	it('renders header text', () => {
		const { lastFrame } = renderWithProviders(
			<Layout headerText="Test Header">
				<Text>Content</Text>
			</Layout>,
		);

		const output = lastFrame();
		expect(output).toContain('Test Header');
		expect(output).toContain('Content');
	});

	it('renders footer text', () => {
		const { lastFrame } = renderWithProviders(
			<Layout headerText="Header" footerText="Footer instructions">
				<Text>Content</Text>
			</Layout>,
		);

		const output = lastFrame();
		expect(output).toContain('Footer instructions');
	});

	it('shows navigation instructions when enabled', () => {
		const { lastFrame } = renderWithProviders(
			<Layout headerText="Header" showNavigationInstructions={true}>
				<Text>Content</Text>
			</Layout>,
		);

		const output = lastFrame();
		expect(output).toContain('↑/↓');
		expect(output).toContain('Enter');
		expect(output).toContain('ESC');
	});

	it('hides navigation instructions when disabled', () => {
		const { lastFrame } = renderWithProviders(
			<Layout headerText="Header" showNavigationInstructions={false}>
				<Text>Content</Text>
			</Layout>,
		);

		const output = lastFrame();
		expect(output).not.toContain('↑/↓');
	});

	it('shows dry-run banner in dry-run mode', () => {
		const { lastFrame } = renderWithProviders(
			<Layout headerText="Header">
				<Text>Content</Text>
			</Layout>,
			{ isDryRun: true },
		);

		const output = lastFrame();
		expect(output).toContain('DRY RUN MODE');
		expect(output).toContain('Operations will be validated but not executed');
	});

	it('hides dry-run banner in normal mode', () => {
		const { lastFrame } = renderWithProviders(
			<Layout headerText="Header">
				<Text>Content</Text>
			</Layout>,
			{ isDryRun: false },
		);

		const output = lastFrame();
		expect(output).not.toContain('DRY RUN MODE');
	});

	it('renders children content', () => {
		const { lastFrame } = renderWithProviders(
			<Layout headerText="Header">
				<Text>Custom child content</Text>
				<Text>Second child</Text>
			</Layout>,
		);

		const output = lastFrame();
		expect(output).toContain('Custom child content');
		expect(output).toContain('Second child');
	});

	it('renders without optional props', () => {
		const { lastFrame } = renderWithProviders(
			<Layout>
				<Text>Just content</Text>
			</Layout>,
		);

		const output = lastFrame();
		expect(output).toContain('Just content');
	});

	it('renders with all props combined', () => {
		const { lastFrame } = renderWithProviders(
			<Layout headerText="Full Test Header" footerText="Full footer text" showNavigationInstructions={true}>
				<Text>All props content</Text>
			</Layout>,
			{ isDryRun: true },
		);

		const output = lastFrame();
		expect(output).toContain('Full Test Header');
		expect(output).toContain('Full footer text');
		expect(output).toContain('↑/↓');
		expect(output).toContain('DRY RUN MODE');
		expect(output).toContain('All props content');
	});
});
