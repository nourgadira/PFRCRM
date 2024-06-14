import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Input, Row, Col, Card } from "antd";
import { SaveOutlined, DollarOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import { axiosInstance } from "../lib/axios";

const CreatePaiement = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [projectDetails, setProjectDetails] = useState(null);

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
        try {
            const response = await axiosInstance.post(`/paiememnt`, {
                ...values,
                projet: projectId
            });
            if (response.status === 200) {
                navigate('/Paiement');
            }
        } catch (error) {
            console.error("Erreur lors de la soumission du paiement :", error);
        }
    };

    // Map des icônes pour les suffixes
    const iconMap = {
        montant: <DollarOutlined />,
        notes: <SaveOutlined />,
    };

    return (
        <Layout>
            <Card className="shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary"> &#128194; LES PROJETS</h6>
                </div>
                <div className="card-body">

                </div>
            </Card>
            {projectDetails && (
                <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px', color: '#1890ff', fontSize: '24px' }}>
                    Créer un paiement pour le projet: {projectDetails.nom}
                </h2>
            )}
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Card>
                            <Form layout="vertical" form={form} onFinish={submitForm}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Montant"
                                            name="montant"
                                            rules={[{ required: true, message: 'Veuillez saisir un montant' }]}
                                        >
                                            <Input suffix={iconMap['montant']} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Notes"
                                            name="notes"
                                            rules={[{ required: true, message: 'Veuillez saisir des notes' }]}
                                        >
                                            <Input suffix={iconMap['notes']} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                    Enregistrer
                                </Button>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CreatePaiement;
