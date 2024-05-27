const { defineConfig } = require("@playwright/test");
const { devices } = require("@playwright/test");

const config = {
    testDir: 'tests',
    workers: 1,
    fullyParallel: true,
    use: {
        baseURL: 'https://en.wikipedia.org/'
    },
    projects: [
        {
            name: 'QA Automation - Test task',
            use: {
                ...devices['Desktop Chrome'],
                headless: false
            },
        },
    ],
}

module.exports = defineConfig(config);
