#!/usr/bin/env bash
#
# Prepare and run playwright tests in a single example directory.

set -eux

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <type> <example>"
    exit 1
fi

export TYPE=$1
export EXAMPLE=$2

export SANITISED_EXAMPLE=$EXAMPLE

if [[ $EXAMPLE =~ _vite$ ]]; then
  export PORT=5173
  export SERVE_CMD="npm run dev"
elif [[ $EXAMPLE =~ ^angular_ng$ ]]; then
  export PORT=4200
  export SERVE_CMD="npm run start"
  # Angular annoyingly converts underscores to dashes
  export SANITISED_EXAMPLE=angular-ng
else
  export PORT=4500
  export SERVE_CMD="npm run serve"
fi


function merge-json() {
  # merge the second json file into the first.
  TEMP_FILE=$(mktemp)
  jq '. * input' $1 $2 > TEMP_FILE && mv TEMP_FILE $1
}

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
    baseURL: 'http://localhost:$PORT',
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
    url: 'http://localhost:$PORT',
    reuseExistingServer: !process.env.CI
  },
  snapshotPathTemplate: '{testDir}/../../../../tests/snapshots/{arg}{ext}'
});
EOF

# 4. Add test commands to package.json
cat > temp.json << EOF
{
  "scripts": {
    "serve": "npm explore $SANITISED_EXAMPLE -- $SERVE_CMD",
    "test": "playwright test",
    "test:ui": "playwright test --ui"
  }
}
EOF
merge-json package.json temp.json
rm temp.json

# 5. Copy tests into temp example directory
cp -r ../../../tests .

# 6. Install playwright browser
npx playwright install chromium

# 7. Run tests
npm run test
