import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { axiosInstance } from "../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from '../Layout';

const { Option } = Select;

const CreateRisque = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/risque`, {
                ...values,
                projet: projectId
            });
            if (response.status === 200) {
                navigate('/Risques');
            }
        } catch (error) {
            console.error("Erreur lors de la soumission du risque :", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div>
                <h1>Créer un Risque</h1>
                <Form
                    form={form}
                    name="create_risque_form"
                    onFinish={submitForm}
                    layout="vertical"
                >
                    <Form.Item
                        label="Nom"
                        name="nom"
                        rules={[
                            { required: true, message: "Veuillez saisir le nom du risque !" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { required: true, message: "Veuillez saisir la description du risque !" },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Probabilité"
                        name="probabilite"
                        rules={[
                            { required: true, message: "Veuillez saisir la probabilité du risque !" },
                        ]}
                    >
                        <Select placeholder="Sélectionnez une probabilité">
                            <Option value="Faible">Faible</Option>
                            <Option value="Moyenne">Moyenne</Option>
                            <Option value="Élevée">Élevée</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Niveau"
                        name="niveau"
                        rules={[
                            { required: true, message: "Veuillez saisir le niveau du risque !" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Impact"
                        name="impact"
                        rules={[
                            { required: true, message: "Veuillez saisir l'impact du risque !" },
                        ]}
                    >
                        <Select placeholder="Sélectionnez un impact">
                            <Option value="Faible">Faible</Option>
                            <Option value="Moyenne">Moyenne</Option>
                            <Option value="Élevée">Élevée</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Créer le Risque
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Layout>
    );
};

export default CreateRisque;
