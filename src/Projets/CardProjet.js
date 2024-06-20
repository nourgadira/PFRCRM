import { Button, Card, Flex, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { ChartPie } from "../Charts"; // Assuming ChartPie is your custom chart component
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useEffect, useState } from "react";
import "./styles.css"; // Importez votre fichier CSS

export const CardProjet = ({ _id, nom, description, dateDebut, dateFin, coutProjet, fichier }) => {

    const { data: taches, isLoading } = useQuery({
        queryKey: ["taches", _id],
        queryFn: async () => {
            const response = await axiosInstance.get("/tasks");
            const data = response.data.filter(tache => tache.projet._id === _id);
            return data;
        },
    });
    const todo = {
        type: "Tâches à faire",
        value: taches?.filter(d => d.etat === "todo")?.length
    };

    const inprogress = {
        type: "Tâches en cours",
        value: taches?.filter(d => d.etat === "INPROGRESS")?.length
    };

    const done = {
        type: "Tâches terminées",
        value: taches?.filter(d => d.etat === "done")?.length
    };

    return (
        <Card style={{ width: "100%" }}>
            <Link to={`/projets/${_id}/taches`} style={{ fontWeight: 'bold', fontSize: '24px', textDecoration: 'unset' }}>{nom}</Link>
            <Flex gap={5} style={{ marginTop: '10px' }}>
                <div className="flex flex-col gap-6">
                    <Typography.Title level={5}>Description: {description}</Typography.Title>
                    <Typography.Title level={5}>Date de début: {dayjs(dateDebut).format('YYYY-MM-DD')}</Typography.Title>
                    <Typography.Title level={5}>Date de fin: {dayjs(dateFin).format('YYYY-MM-DD')}</Typography.Title>
                    <Typography.Title level={5}>Coût du projet: {coutProjet}</Typography.Title>
                </div>
                <ChartPie data={[todo, inprogress, done]} style={{ width: '2px', height: '2px' }} />
            </Flex>
        </Card>
    );
};
