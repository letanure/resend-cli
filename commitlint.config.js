export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only
        'style',    // Code style changes
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf',     // Performance improvement
        'test',     // Adding or updating tests
        'chore',    // Changes to build process or auxiliary tools
        'revert',   // Reverts a previous commit
        'build',    // Changes to build system or dependencies
        'ci'        // Changes to CI configuration
      ]
    ]
  }
};