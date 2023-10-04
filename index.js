import {WebUntis} from 'webuntis';
import express from 'express';
import moment from "moment";
import cors from "cors";

const app = express();
const untis = new WebUntis('htbla_wels', 'terminal3', 'terminal3', 'hypate.webuntis.com');

await untis.login();

const classes = await untis.getClasses(true, (await untis.getLatestSchoolyear()).id) //--> Klassen[]
const classesMap = new Map();

classes.forEach((x) => classesMap.set(x.name, x)) // ---> Map Key: Klassenname Value: Klasse

app.use(cors())

app.get("/timetable", async (req, res) => {

    try {
        let schoolClass = req.query.class;
        if (schoolClass === undefined) {

            res.send("Undefined class!")

            return;

        }
        let clazz = classesMap.get(schoolClass)
        let timetable = await untis.getTimetableForRange(moment().startOf('week').add(1, 'days').toDate(), moment().startOf('week').add(5, 'days').toDate(), clazz.id, 1)
        let map = new Map();
        for (let lesson of timetable) {

            let date = lesson.date.toString().trim();
            if (map.get(date) === undefined) map.set(date, [])
            map.set(date, [...map.get(date), lesson])
        }
        /* res.send(await untis.getTimetableForWeek(new Date(), clazz.id, 3))
         let timetable =  new Map()
         for (let i = 0; i < 5; i++) {
             timetable.set(i, await untis.getTimetableFor(moment().startOf('week').add(i+1, 'days').toDate(), clazz.id, 1))
             console.log(timetable)
         }*/

        res.send(JSON.stringify([...map]))
        //res.send(timetable.sort((a, b) => (a.startTime - b.startTime)))

    } catch (err) {
        console.log(err)
        res.send("Internal server error or unknown class :C").status(500)
    }
})

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