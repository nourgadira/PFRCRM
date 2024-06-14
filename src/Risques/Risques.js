import React, { useState, useEffect } from 'react';
import { Table, message, Card, Button, Popconfirm } from 'antd';
import { axiosInstance } from '../lib/axios';
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GetAllRisques = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [risques, setRisques] = useState([]);

    const fetchRisques = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/risque', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    includeProject: true
                }
            });

            setRisques(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des paiements:', error);
        }
    };

    useEffect(() => {
        fetchRisques();
    }, [navigate]);

    const getColor = (value) => {
        switch (value) {
            case 'Faible':
                return '#7AA95C'; // Green
            case 'Moyenne':
                return '#F27438'; // Orange
            case 'Élevée':
                return '#BD2A2E'; // Red
            default:
                return '';
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await axios.delete(`http://localhost:8080/api/risque/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            message.success('Le risque a été supprimé avec succès.');
            fetchRisques(); // Rechargez la liste après la suppression
        } catch (error) {
            console.error('Erreur lors de la suppression du risque:', error);
        }
    };

    const columns = [
        { title: 'Nom', dataIndex: 'nom', key: 'nom' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Probabilité',
            dataIndex: 'probabilite',
            key: 'probabilite',
            render: (text) => (
                <div style={{ backgroundColor: getColor(text), padding: '5px', color: 'white' }}>
                    {text}
                </div>
            )
        },
        {
            title: 'Niveau',
            dataIndex: 'niveau',
            key: 'niveau',

        },
        {
            title: 'Impact',
            dataIndex: 'impact',
            key: 'impact',
            render: (text) => (
                <div style={{ backgroundColor: getColor(text), padding: '5px', color: 'white' }}>
                    {text}
                </div>
            )
        },

        {
            title: "Nom du Projet",
            dataIndex: "projet",
            key: "projet",
            render: (_, record) => (
                <span>{record?.projet?.nom}</span>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <Popconfirm
                        title="Êtes-vous sûr de vouloir supprimer ce risque?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button type="danger" size="small">Supprimer</Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <Layout>
            <Card className="shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Liste des risques</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table
                            dataSource={risques}
                            columns={columns}
                            loading={loading}
                            rowKey="_id"
                        />
                    </div>
                </div>
            </Card>
        </Layout >
    );
};

export default GetAllRisques;
