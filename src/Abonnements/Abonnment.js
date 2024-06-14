import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, message } from "antd";
import Layout from "../Layout";
import dayjs from 'dayjs';

const ListeRisques = () => {
    const [risques, setRisques] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRisques = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/api/risques");
                setRisques(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des risques :", error);
                message.error("Une erreur est survenue lors de la récupération des risques");
            } finally {
                setLoading(false);
            }
        };

        fetchRisques();
    }, []);

    const columns = [
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Probabilité",
            dataIndex: "probabilite",
            key: "probabilite",
        },
        {
            title: "Niveau",
            dataIndex: "niveau",
            key: "niveau",
        },
        {
            title: "Impact",
            dataIndex: "impact",
            key: "impact",
        },
        {
            title: "Date de création",
            dataIndex: "dateCreation",
            key: "dateCreation",
            render: (_, record) => (
                <span>{dayjs(record.dateCreation).format('YYYY-MM-DD')}</span>
            ),
        },
    ];

    return (
        <Layout>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <Table
                            dataSource={risques}
                            columns={columns}
                            loading={loading}
                            bordered
                            pagination={{ pageSize: 10 }}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ListeRisques;
