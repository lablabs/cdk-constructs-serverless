module.exports = {
	extends: [
		'plugin:@microsoft/eslint-plugin-sdl/node',
		'plugin:@microsoft/eslint-plugin-sdl/common',
		'plugin:security/recommended-legacy'
	],
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module'
	},
	plugins: ['prettier', 'simple-import-sort', '@microsoft/eslint-plugin-sdl'],
	rules: {
		'prettier/prettier': 'error',
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': 'error'
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parser: '@typescript-eslint/parser',
			extends: ['plugin:@microsoft/eslint-plugin-sdl/typescript'],
			parserOptions: {
				project: [
					'./tsconfig.json',
					'./services/**/tsconfig.json',
					'./packages/**/tsconfig.json',
					'./extra/**/tsconfig.json'
				]
			},
			plugins: ['@typescript-eslint'],
			rules: {
				'@typescript-eslint/ban-ts-comment': [
					'error',
					{
						'ts-expect-error': 'allow-with-description',
						'ts-ignore': 'allow-with-description',
						'ts-nocheck': true,
						'ts-check': false
					}
				],
				'@typescript-eslint/ban-types': ['off'],
				'@typescript-eslint/explicit-function-return-type': 'error',
				'@typescript-eslint/no-explicit-any': ['warn'],
				'@typescript-eslint/no-unused-vars': 'error',
				'@typescript-eslint/no-use-before-define': ['warn'],
				'@typescript-eslint/no-non-null-assertion': ['warn'],
				'@typescript-eslint/consistent-type-imports': 'error'
			}
		},
		{
			files: ['*.spec.ts', '*.it-spec.ts', '*.mock.ts', '*.e2e.ts'],
			plugins: ['@typescript-eslint'],
			rules: {
				'@typescript-eslint/no-explicit-any': ['off'],
				'@typescript-eslint/no-non-null-assertion': ['off']
			}
		}
	]
}
