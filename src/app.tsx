import React from 'react';
import {Text, Box} from 'ink';

export const App = () => {
	return (
		<Box flexDirection="column">
			<Text color="green">
				Welcome to Resend CLI! 🚀
			</Text>
			<Text>
				This is a TypeScript + Ink CLI wrapper for the Resend API.
			</Text>
		</Box>
	);
};