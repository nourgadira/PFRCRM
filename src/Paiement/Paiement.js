import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { Button, Table, Space, Typography, Modal, Form, Input } from 'antd';
import { decodeToken } from '../lib/jwt';
import { axiosInstance } from '../lib/axios';
import dayjs from 'dayjs';
import { Select } from 'antd';
import { DatePicker } from 'antd';

const { Column } = Table;
const { Text } = Typography;

const Paiement = () => {

    const [paiements, setPaiements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPaiement, setSelectedPaiement] = useState(null);
    const navigate = useNavigate();
    const decoded = decodeToken(localStorage.getItem('token'));

    const fetchPaiements = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/paiememnt', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    includeProject: true
                }
            });

            setPaiements(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des paiements:', error);
        }
    };

    useEffect(() => {
        fetchPaiements();
    }, [navigate]);

    const handleVoirDetails = (record) => {
        navigate(`/DetailsAvance/${record._id}/${record.montant}`);
    };


    const handleAjoutAvance = (record) => {
        setSelectedPaiement(record);
        setModalVisible(true);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const handleAjouterAvance = async (values) => {
        try {
            if (!selectedPaiement || !selectedPaiement._id || !selectedPaiement.projet._id) {
                console.error('Paiement sélectionné invalide.');
                return;
            }

            const paiementProjetId = selectedPaiement._id;
            const avance = values.avance;
            const dateavance = values.dateavance;

            await axios.post(`http://localhost:8080/api/paiement/${paiementProjetId}/avance`, {
                avance: avance,
                dateavance: dateavance,
            });

            setModalVisible(false);
            fetchPaiements();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'avance:', error);
        }
    };

    const columns = [
        {
            title: "Montant",
            dataIndex: "montant",
            key: "montant",
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
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
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleAjoutAvance(record)}>Ajouter Avance</Button>
                    <Button onClick={() => handleVoirDetails(record)}>Voir Détails Avance</Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 className="h3 mb-0 text-gray-800">LISTE DES PAIEMENTS</h1>
                        </div>
                        <Table columns={columns} dataSource={paiements} loading={loading} />
                    </div>
                </div>
            </div>
            <Modal
                title="Ajout Avance"
                visible={modalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                {selectedPaiement && (
                    <Form onFinish={handleAjouterAvance}>
                        <Form.Item
                            label="Avance"
                            name="avance"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez saisir le montant de l\'avance',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Date Avance"
                            name="dateavance"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez saisir la date de l\'avance',
                                },
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>

                        <Form.Item
                            label="Type Paiement"
                            name="typePaiement"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez sélectionner un type de paiement',
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value="carteBancaire">Carte Bancaire</Select.Option>
                                <Select.Option value="especes">Espèces</Select.Option>
                            </Select>
                        </Form.Item>



                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Ajouter Avance
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Layout>
    );
};

export default Paiement;
