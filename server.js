const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/sort', (req, res) => {
    const { data, sortBy, sortOrder } = req.body;
    if (!data || !sortBy) {
        return res.status(400).send('Data and sortBy are required.');
    }

    if (!sortOrder) {
        return res.status(400).send('sortOrder is required.');
    }

    const order = sortOrder === 'desc' ? -1 : 1;

    const compareNumeric = (a, b, key) => {
        const valueA = parseFloat(a[key]);
        const valueB = parseFloat(b[key]);

        if (isNaN(valueA) && isNaN(valueB)) return 0;
        if (isNaN(valueA)) return -1 * order;
        if (isNaN(valueB)) return 1 * order;

        return order * (valueA - valueB);
    };

    const compareAlphabetical = (a, b, key) => {
        return order * a[key].localeCompare(b[key]);
    };

    let sortedData;
    switch (sortBy) {
        case 'alphabetical':
            sortedData = [...data].sort((a, b) => compareAlphabetical(a, b, 'name'));
            break;
        case 'percentage':
            sortedData = [...data].sort((a, b) => compareNumeric(a, b, 'percentage'));
            break;
        case 'gdp':
            sortedData = [...data].sort((a, b) => compareNumeric(a, b, 'gdp'));
            break;
        case 'population':
            sortedData = [...data].sort((a, b) => compareNumeric(a, b, 'population'));
            break;
        default:
            return res.status(400).send(`Invalid ${sortBy} value.`);
    }

    res.json(sortedData.slice(0, 10));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});