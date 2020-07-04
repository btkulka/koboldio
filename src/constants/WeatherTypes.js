export const PRECIPITATION_STATES = {
    Clear: 'Clear',
    Overcast: 'Overcast',
    Cloudy: 'Cloudy',
    Drizzling: 'Drizzling',
    Precipitating: 'Precipitating',
    Storming: 'Storming',
    Cataclysmic: 'Cataclysmic'
};

export const BASE_BIOME_TYPES = {
    Plains: {
        name: 'Plains',
        averageTemp: 70,
        averagePrecipitation: 0.25
    },
    Forest: {
        name: 'Forest',
        averageTemp: 65,
        averagePrecipitation: 0.2
    },
    Marsh: {
        name: 'Marsh',
        averageTemp: 75,
        averagePrecipitation: 0.3
    },
    Swamp: {
        name: 'Swamp',
        averageTemp: 75,
        averagePrecipitation: 0.3
    },
    Coast: {
        name: 'Coast',
        averageTemp: 75,
        averagePrecipitation: 0.3
    },
    Ocean: {
        name: 'Ocean',
        averageTemp: 75,
        averagePrecipitation: 0.35
    },
    Mountain: {
        name: 'Mountain',
        averageTemp: 60,
        averagePrecipitation: 0.15
    },
    Glacier: {
        name: 'Glacier',
        averageTemp: 50,
        averagePrecipitation: 0.25
    },
    Volcano: {
        name: 'Volcano',
        averageTemp: 80,
        averagePrecipitation: 0.1
    },
    Desert: {
        name: 'Desert',
        averageTemp: 80,
        averagePrecipitation: 0.05
    }
}

export const SEASONAL_TEMPS = [
    -10, -5, 0, 5, 10, 15, 10, 5, 0, -5, -10, -15
]

export const TIME_OF_DAY_TEMPS = [
    -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 10, 8, 6, 4, 2, 0, -2, -4, -6, -8, -10
]