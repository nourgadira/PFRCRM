import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, Row, Col, DatePicker } from "antd";
import { SaveOutlined, DollarOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import { axiosInstance } from "../lib/axios";
import axios from 'axios';

// Définir la fonction calculerResteAPayerPourProjet
const calculerResteAPayerPourProjet = async (projetId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/projet/${projetId}/resteAPayer`);
        return response.data.resteAPayer;
    } catch (error) {
        console.error(`Erreur lors du calcul du reste à payer pour le projet ${projetId}:`, error);

    }
};

const CreateFacture = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [projectDetails, setProjectDetails] = useState(null);
    const [resteAPayer, setResteAPayer] = useState(null); // Déclarer resteAPayer comme state

    // Fonction pour récupérer les détails du projet par ID
    const fetchProjectDetails = async (projectId) => {
        try {
            const response = await axiosInstance.get(`/projet/${projectId}`);
            setProjectDetails(response.data.projet);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du projet :", error);
        }
    };

    // Utiliser useEffect pour appeler fetchProjectDetails lors du montage du composant
    useEffect(() => {
        if (projectId) {
            fetchProjectDetails(projectId);
        }
    }, [projectId]);

    // Fonction de soumission du formulaire
    const submitForm = async (values) => {
        // Vérifier si la date de la facture est vide
        const dateFacture = values.dateFacture ? values.dateFacture.toISOString().slice(0, 10) : '';
        const invoiceNumber = Math.floor(Math.random() * 10000) + 1;

        try {
            const response = await axiosInstance.post(`/paiement`, {
                ...values,
                dateFacture,
                status: 'Payé',
                numeroFacture: invoiceNumber,
                projet: projectId,
                resteAPayer: resteAPayer, // Utiliser la variable d'état resteAPayer
            });
            if (response.status === 200) {
                navigate('/Paiement');
            }
        } catch (error) {
            console.error("Erreur lors de la soumission de la facture :", error);
        }
    };

    // Utiliser useEffect pour calculer resteAPayer lorsque projectId change
    useEffect(() => {
        const calculateResteAPayer = async () => {
            if (projectId) {
                // Effectuer le calcul pour déterminer resteAPayer
                const resteAPayerValue = await calculerResteAPayerPourProjet(projectId);
                setResteAPayer(resteAPayerValue);
            }
        };
        calculateResteAPayer();
    }, [projectId]);

    return (
        <Layout>
            {projectDetails && (
                <div style={{ margin: '20px auto', maxWidth: '800px', border: '1px solid #ccc', padding: '20px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Facture</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <p><strong>Projet:</strong> {projectDetails.nom}</p>
                            <p><strong>Client:</strong> {projectDetails.client}</p>
                            <p><strong>Contact:</strong> {projectDetails.contact}</p>
                        </div>
                        <div>
                            {/* Ne pas afficher les détails de la facture ici */}
                        </div>
                    </div>
                    <Form form={form} onFinish={submitForm}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Montant"
                                    name="montant"
                                    rules={[{ required: true, message: 'Veuillez saisir un montant' }]}
                                >
                                    <Input prefix={<DollarOutlined />} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Date de la facture"
                                    name="dateFacture"
                                    rules={[{ required: true, message: 'Veuillez choisir une date' }]}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Notes"
                                    name="notes"
                                    rules={[{ required: true, message: 'Veuillez saisir des notes' }]}
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                            Enregistrer la facture
                        </Button>
                    </Form>
                </div>
            )}
        </Layout>
    );
};

export default CreateFacture;
