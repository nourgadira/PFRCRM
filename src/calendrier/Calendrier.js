import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MOCK_EVENTS } from "./event";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
const localizer = momentLocalizer(moment);
// gérer les couleurs aleratoires 
function Calendrier() {
    function getRandomHexColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const { data: projets } = useQuery({
        queryKey: ['projets'],
        queryFn: async () => {
            return axiosInstance.get('/projets').then(res => res.data.projets)
        }
    })

    const events = projets?.map((projet) => {
        return {
            title: projet.nom,
            start: new Date(projet.dateDebut),
            end: new Date(projet.dateFin),
            color: getRandomHexColor(),
        };
    });
    return (
        <div className="App" style={{ padding: "14px" }}>
            <Calendar
                localizer={localizer}
                startAccessor={"start"}
                events={events}
                endAccessor={"end"}
                style={{
                    height: "520px",
                }}
                eventPropGetter={(event) => {
                    return {
                        style: {
                            backgroundColor: event.color,
                        },
                    };
                }}
                onSelectEvent={(event) => alert(event.title)}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            />
        </div>
    );
}

export default Calendrier;