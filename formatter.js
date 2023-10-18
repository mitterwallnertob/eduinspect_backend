// Importieren Sie die notwendigen Module
import express from 'express';
import axios from 'axios';
import cors from "cors";

//http://localhost:8083/timetable

const app = express();

app.use(cors());

const originalServiceUrl = 'http://localhost:8082/timetable'; // URL des ursprünglichen Services

app.get("/timetable", async (req, res) => {
    try {
        // Rufen Sie Daten vom ursprünglichen Service ab
        const response = await axios.get(originalServiceUrl);

        // Hier können Sie die Daten verarbeiten, um sie nach Tagen und Stunden zu sortieren
        const jsonData = response.data;
        const sortedData = sortData(jsonData);

        res.send(sortedData); // Senden Sie die sortierten Daten an den Client
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

// Funktion zum Sortieren der Daten nach Tagen und Stunden
function sortData(data) {
    const groupedData = {};

    for (const item of data) {
        const date = item.date;
        const startTime = item.startTime;

        if (!groupedData[date]) {
            groupedData[date] = {};
        }

        if (!groupedData[date][startTime]) {
            groupedData[date][startTime] = [];
        }

        groupedData[date][startTime].push(item);
    }

    const sortedData = [];

    for (const date in groupedData) {
        for (const startTime in groupedData[date]) {
            sortedData.push(groupedData[date][startTime]);
        }
    }

    return sortedData;
}

// Hier können Sie weitere Endpunkte und Funktionen für Ihren neuen Service hinzufügen

const PORT = 8083; // Port für den neuen Service
app.listen(PORT, () => {
    console.log('New Server running on port ' + PORT);
});