import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { Button, Table, Space, Typography, Modal, Form, Input, Tag, Select, DatePicker, Card } from 'antd';
import { decodeToken } from '../lib/jwt';
import dayjs from 'dayjs';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Column } = Table;
const { Text } = Typography;

const Paiement = () => {
    const [paiements, setPaiements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPaiement, setSelectedPaiement] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const decoded = decodeToken(localStorage.getItem('token'));

    const fetchPaiements = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/paiement', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    includeProject: true
                }
            });

            const paiementsAvecResteAPayer = await Promise.all(response.data.map(async (paiement) => {
                if (!paiement.projet || !paiement.projet._id) {
                    console.warn(`Paiement ${paiement._id} n'a pas de projet valide ou d'ID de projet.`);
                    return { ...paiement, resteAPayer: 'N/A', status: 'Inconnu' };
                }

                const resteAPayer = await calculerResteAPayerPourProjet(paiement.projet._id);
                const status = resteAPayer === 0 ? 'Payé' : 'Impayé';
                return { ...paiement, resteAPayer, status };
            }));
            setPaiements(paiementsAvecResteAPayer);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des paiements:', error);
        }
    };

    const calculerResteAPayerPourProjet = async (projetId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/projet/${projetId}/resteAPayer`);
            return response.data.resteAPayer;
        } catch (error) {
            console.error(`Erreur lors du calcul du reste à payer pour le projet ${projetId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        fetchPaiements();
    }, [navigate]);

    const handleAjoutAvance = (record) => {
        if (record.status === 'Payé') {
            alert('Le projet est déjà payé. Aucune avance n\'est nécessaire.');
            return;
        }

        setSelectedPaiement(record);
        setModalVisible(true);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await axios.post('http://localhost:8080/api/avance', {
                ...values,
                projetId: selectedPaiement.projet._id,
            });
            fetchPaiements();
            setModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'avance:', error);
        }
    };

    const handleVoirDetailsAvance = (projetId, montantPaiement) => {
        navigate(`/details-avance/${projetId}/${montantPaiement}`);
    };

    const getStatusTag = (status) => {
        let color = '';
        let icon = null;
        switch (status) {
            case 'Payé':
                color = '#52c41a'; // Vert
                icon = <CheckCircleOutlined />;
                break;
            case 'Impayé':
                color = '#ff4d4f'; // Rouge clair
                icon = <CloseCircleOutlined />;
                break;
            default:
                color = 'default';
                break;
        }
        return <Tag color={color} icon={icon}>{status.toUpperCase()}</Tag>;
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
            title: "Reste à Payer",
            dataIndex: "resteAPayer",
            key: "resteAPayer",
            render: (_, record) => (
                <span>{record.resteAPayer}</span>
            )
        },
        {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusTag(status),
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleAjoutAvance(record)}>Ajouter Avance</Button>
                    <Button onClick={() => handleVoirDetailsAvance(record.projet._id, record.montant)}>Voir Détails Avance</Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <Card className="shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary"> &#128194; LES PAIEMENTS</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table columns={columns} dataSource={paiements} loading={loading} />
                    </div>
                </div>
            </Card>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Ajouter Avance"
                visible={modalVisible}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="avance"
                        label="Avance"
                        rules={[{ required: true, message: 'Veuillez entrer le montant de l\'avance' }]}
                    >
                        <Input type="number" placeholder="Montant de l'avance" />
                    </Form.Item>
                    <Form.Item
                        name="dateavance"
                        label="Date de l'Avance"
                        rules={[{ required: true, message: 'Veuillez sélectionner la date de l\'avance' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="typeavance"
                        label="Type d'Avance"
                        rules={[{ required: true, message: 'Veuillez sélectionner le type d\'avance' }]}
                    >
                        <Select>
                            <Select.Option value="carte banncaire">carte banncaire </Select.Option>
                            <Select.Option value="especes">especes</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Paiement;
