import express from 'express';
import axios from 'axios';
import cors from "cors";

//http://localhost:8084/timetable

const app = express();

app.use(cors());

const originalServiceUrl = 'http://localhost:8082/timetable';

async function transformDataToGroupedArray() {
    try {
        const response = await axios.get(originalServiceUrl);
        const jsonData = response.data;

        const groupedData = {};

        for (const item of jsonData) {
            const date = item.date;

            if (!groupedData[date]) {
                groupedData[date] = [];
            }

            groupedData[date].push(item);
        }

        // Sortieren Sie die Stunden im inneren Array nach der Startzeit
        for (const date in groupedData) {
            groupedData[date].sort((a, b) => a.startTime - b.startTime);
        }

        // Die verschachtelten Daten in einem Array speichern
        const sortedData = Object.keys(groupedData)
            .sort((a, b) => a - b)
            .map(date => groupedData[date]);

        return sortedData;
    } catch (error) {
        console.error(error);
        return [];
    }
}

app.get("/timetable", async (req, res) => {
    const groupedData = await transformDataToGroupedArray();
    res.json(groupedData);
});

const PORT = 8084;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
