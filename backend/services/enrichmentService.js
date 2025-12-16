import axios from 'axios';

const enrichName = async (name) => {
    try {
        const response = await axios.get(`https://api.nationalize.io?name=${name}`);
        const data = response.data;

        if (data.country && data.country.length > 0) {
            const bestMatch = data.country.reduce((prev, current) =>
                (prev.probability > current.probability) ? prev : current
            );
            return {
                country: bestMatch.country_id,
                probability: bestMatch.probability
            };
        }
        return { country: 'Unknown', probability: 0 };
    } catch (error) {
        console.error(`Error enriching name ${name}:`, error.message);
        return { country: 'Error', probability: 0 };
    }
};

export const processBatch = async (names) => {
    const promises = names.map(async (name) => {
        const result = await enrichName(name);
        return {
            name,
            ...result
        };
    });
    return await Promise.all(promises);
};
