
import fs from 'fs';
import path from 'path';

const COUNT = 5000;
const statuses = ['Active', 'Pending', 'Completed', 'Maintenance'];
const baseLat = 12.9716;
const baseLng = 77.5946;

const generateData = () => {
    const data = [];
    for (let i = 0; i < COUNT; i++) {
        data.push({
            id: crypto.randomUUID(),
            projectName: `Project ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][Math.floor(Math.random() * 5)]}-${i + 1}`,
            latitude: baseLat + (Math.random() - 0.5) * 0.5,
            longitude: baseLng + (Math.random() - 0.5) * 0.5,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
        });
    }
    return data;
};

const data = generateData();
const outputPath = path.resolve('public', 'mockData.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Generated ${COUNT} rows at ${outputPath}`);
