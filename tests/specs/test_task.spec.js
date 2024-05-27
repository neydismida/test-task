import test, { expect } from '../fixtures/base';

test.describe('Test Task', async () => {
    test('Get country data and sort it', async ({ apiHelper, wikiPage }) => {
        const populationArray = []
        const gdpArray = []
        const countryArray = []

        await test.step('Get data from the population table and put it to array', async () => {
            (await wikiPage.getDataFromPopulationTable()).map(countyItem => populationArray.push(countyItem))
        });

        await test.step('Get data from the GDP table and put it to array', async () => {
            (await wikiPage.getDataFromGDPTable()).map(countyItem => gdpArray.push(countyItem))
        });

        await test.step('Merge two arrays', async () => {
            (await wikiPage.mergeData(populationArray, gdpArray)).map(countyItem => countryArray.push(countyItem))
        });

        await test.step('Sort Array', async () => {
            await Promise.all([
                wikiPage.sortData(countryArray, 'name'),
                wikiPage.sortData(countryArray, 'population'),
                wikiPage.sortData(countryArray, 'percentage'),
                wikiPage.sortData(countryArray, 'gdp')
            ])
        });

        await test.step('POST: /sort', async() => {
            const [alphabetical, percentage, gdp, population] = await Promise.all([
                apiHelper.getTop10(countryArray, 'alphabetical', 'desc'),
                apiHelper.getTop10(countryArray, 'percentage', 'desc'),
                apiHelper.getTop10(countryArray, 'gdp', 'desc'),
                apiHelper.getTop10(countryArray, 'population', 'desc')
            ]);

            expect(alphabetical).toHaveLength(10);
            expect(percentage).toHaveLength(10);
            expect(gdp).toHaveLength(10);
            expect(population).toHaveLength(10);
        })
    });
});
