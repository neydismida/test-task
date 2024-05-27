exports.ApiHelper = class ApiHelper {
    async getTop10(data, sortBy, sortOrder) {
        const response = await fetch('http://localhost:3000/sort', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data, sortBy, sortOrder }),
        });

        return await response.json();
    }
}
