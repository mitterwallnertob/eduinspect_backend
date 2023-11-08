import express from 'express';
import axios from 'axios';
import cors from "cors";
import moment from "moment";

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

        const sortedDataImportant = sortedData.map(days => {
            return days.map(lessons => ({
                date: lessons.date,
                startTime: lessons.startTime,
                endTime: lessons.endTime,
                subject: lessons.su[0].name,
                teacher: lessons.te[0].name,
                klasse: lessons.kl[0].name,
                room: lessons.kl[0].name
            }));
        });

        console.log(sortedDataImportant);
        const updatedSchedule = [];

        const daysOfWeek = [1, 2, 3, 4, 5]; // 1 for Monday, 2 for Tuesday, etc.

        // Iterate over the teacher's schedule
        for (let i = 0; i < daysOfWeek.length; i++) {
            updatedSchedule.push(sortedDataImportant[i]); // Add the current day's lessons

            if (i < sortedDataImportant.length - 1) {
                // Calculate the date difference with the next day
                const currentDate = moment(sortedDataImportant[i][0].date, 'YYYYMMDD');
                const nextDate = moment(sortedDataImportant[i + 1][0].date, 'YYYYMMDD');
                const dateDifference = nextDate.diff(currentDate, 'days');

                // Insert empty arrays for missing days
                for (let j = 1; j < dateDifference; j++) {
                    updatedSchedule.push(["empty"]); // Insert empty array for missing days
                }


            }
        }
        console.log("Successfull sent");
        return updatedSchedule;
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
