#!/usr/bin/env bash
#
# Prepare for playwright tests in a single example directory.
# Eventually need to look through all example directories.

set -eux

export TYPE=typescript
export EXAMPLE=vanilla_webpack

# 1. Create and build example code in temporary directory
cd $TYPE && bash ./create_$EXAMPLE.sh && cd ..

# 2. Create *-test directory
mkdir temp/$TYPE/$EXAMPLE-test
cd temp/$TYPE/$EXAMPLE-test

# 3. Create initial package.json
npm init --yes

# 4. Add dev dependencies
npm install --save-dev "@playwright/test"
npm install --save-dev ../$EXAMPLE

# 5. Create playwright.config.ts
cat > playwright.config.ts << EOF
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4500',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:4500',
    reuseExistingServer: !process.env.CI
  }
});
EOF

# 4. Add test commands to package.json
cat > temp.json << EOF
{
  "scripts": {
    "serve": "npm explore $EXAMPLE -- npm run serve",
    "test": "playwright test",
    "test:ui": "playwright test --ui"
  }
}
EOF
npm install --save-dev json-merger
npx json-merger --output package.json --pretty package.json temp.json
rm temp.json

# 5. Copy tests into temp example directory
cp -r ../../../tests .

# Run tests
npm run test
