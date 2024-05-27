exports.WikiPage = class WikiPage {
    constructor(page) {
        this.page = page;
    }

    async getDataFromPopulationTable() {
        await this.page.goto('/wiki/List_of_countries_and_dependencies_by_population');
        return this.page.locator('.wikitable tbody tr').evaluateAll(rows => {
            return rows.slice(1).map(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 4) return null;

                const name = cells[1]?.textContent.trim();
                const population = cells[2]?.textContent.trim().replace(/,/g, '');
                const percentage = cells[3]?.textContent.trim().replace('%', '').replace(/,/g, '');

                if (isNaN(parseInt(population)) || !isNaN(parseInt(name))) return null;
                return name !== 'World' ? { name, population, percentage } : null;
            }).filter(item => item);
        });
    }

    async getDataFromGDPTable() {
        await this.page.goto('/wiki/List_of_countries_by_GDP_(nominal)');
        return this.page.evaluate(() => {
            const table = document.querySelector('.wikitable');
            return Array.from(table.querySelectorAll('tbody tr'))
                .slice(1)
                .map(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length < 3) return null;
                    const name = cells[0]?.innerText.trim();
                    const gdp = cells[2]?.innerText.trim().replace(/,/g, '');
                    if (isNaN(parseInt(gdp))) return null;
                    return { name, gdp };
                })
                .filter(item => item);
        });
    }

    async mergeData(populationData, gdpData) {
        return populationData.map(country => {
            const gdpEntry = gdpData.find(gdpCountry => gdpCountry.name === country.name);
            if (gdpEntry) {
                const gdpValue = gdpEntry.gdp === '-' ? null : gdpEntry.gdp;
                return { ...country, gdp: gdpValue };
            } else {
                return { ...country, gdp: null };
            }
        });
    }

    sortData(array, key) {
        return [...array].sort((a, b) => {
            if (['population', 'percentage'].includes(key)) {
                return parseFloat(a[key]) - parseFloat(b[key]);
            } else if (key === 'gdp') {
                const gdpA = a[key] === null || a[key] === '-' ? -Infinity : Number(a[key]);
                const gdpB = b[key] === null || b[key] === '-' ? -Infinity : Number(b[key]);
                return gdpA - gdpB;
            } else {
                return a[key].localeCompare(b[key]);
            }
        });
    }
}
