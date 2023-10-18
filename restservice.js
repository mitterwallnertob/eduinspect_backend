import {WebUntis} from 'webuntis';
import express from 'express';
import moment from "moment";
import cors from "cors";

//http://localhost:8082/timetable

const app = express();
const untis = new WebUntis('htbla_wels', 'username', 'password', 'hypate.webuntis.com');

await untis.login();

const classes = await untis.getClasses(true, (await untis.getLatestSchoolyear()).id) //--> Klassen[]
const classesMap = new Map();

classes.forEach((x) => classesMap.set(x.name, x)) // ---> Map Key: Klassenname Value: Klasse

const timetable = await untis.getOwnTimetableForRange(moment().startOf('week').add(1, 'days').toDate(), moment().startOf('week').add(5, 'days').toDate())

app.use(cors())

app.get("/timetable", async (req, res) => {

        /*
        let schoolClass = req.query.class;
        if (schoolClass === undefined) {
            res.send("Undefined class!");
            return;
        }

        let clazz = classesMap.get(schoolClass);
        let timetable = await untis.getTimetableForRange(moment().startOf('week').add(1, 'days').toDate(), moment().startOf('week').add(5, 'days').toDate(), clazz.id, 1);

        let map = new Map();

        // Populate the map with lessons grouped by date
        for (let lesson of timetable) {
            let date = lesson.date.toString().trim();
            if (map.get(date) === undefined) map.set(date, []);
            map.get(date).push(lesson);
        }

        // Sort the map by date and then by start time within each date's lessons array
        const sortedMap = new Map([...map.entries()].sort(([dateA, lessonsA], [dateB, lessonsB]) => {
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;

            // If dates are the same, compare start times within each day
            const startTimeA = lessonsA[0].startTime;
            const startTimeB = lessonsB[0].startTime;

            if (startTimeA < startTimeB) return -1;
            if (startTimeA > startTimeB) return 1;

            return 0;
        }));

        res.send(JSON.stringify([...sortedMap]));
        
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error or unknown class :C");
    }
    */
   res.send(timetable);
});

// Send text
app.get("/authenticate", async (req, res) => {

    var username = req.query.username;
    var password = req.query.password;
})

process.on('exit', (code) => {
    untis.logout()
    connection.close()
})


const PORT = 8082;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})