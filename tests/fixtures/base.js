import { test as base } from "@playwright/test";
const { WikiPage } = require('../page-objects/wiki.page');
const { ApiHelper } = require('../helpers/api.helper');

const test = base.extend({
    wikiPage: async ({ page }, use) => {
        await use(new WikiPage(page));
    },
    apiHelper: async ({ page }, use) => {
        await use(new ApiHelper());
    }
});

export default test;
export { expect, Locator } from "@playwright/test";