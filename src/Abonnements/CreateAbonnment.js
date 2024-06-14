import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Button, DatePicker, Form, Input, Select, Card } from "antd";
import { FolderAddOutlined, EuroOutlined, SaveOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const CreateProjet = ({ clientId }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm()
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: async ({ data }) => {
            const { clientId, ...abonnementData } = data; // Exclure l'ID du client de l'abonnement
            await axiosInstance.post(`/abonnement`, { ...abonnementData, clientId })
        },
        onSuccess: () => {
            queryClient.invalidateQueries('abonnement')
            navigate('/Abonnment')
        }
    })

    const iconMap = {
        nomsolution: <Input />,
        typeAbonnement: <Select>
            <Select.Option value="annuel">Annuel</Select.Option>
            <Select.Option value="semestriel">Semestriel</Select.Option>
            <Select.Option value="mensuel">Mensuel</Select.Option>
        </Select>,
        dateDebut: <DatePicker />,
        dateFin: <DatePicker />,
        coutAbonnement: <Input prefix={<EuroOutlined />} />,
    };

    return (
        <Card title={<><FolderAddOutlined /> Créer un abonnement</>} className="mb-4">
            <Form
                layout="vertical"
                form={form}
                onFinish={(values) => mutate({ data: values })}
            >
                <Form.Item
                    label="Nom de la solution"
                    name="nomsolution"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez saisir un nom de solution',
                        },
                    ]}
                >
                    {iconMap['nomsolution']}
                </Form.Item>

                <Form.Item
                    name="clientId"
                    hidden
                    initialValue={clientId} // Si clientId est passé en tant que prop
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Type d'abonnement"
                    name="typeAbonnement"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez sélectionner un type d\'abonnement',
                        },
                    ]}
                >
                    {iconMap['typeAbonnement']}
                </Form.Item>

                <Form.Item
                    label="Date de début"
                    name="dateDebut"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez sélectionner une date de début',
                        },
                    ]}
                >
                    {iconMap['dateDebut']}
                </Form.Item>

                <Form.Item
                    label="Date de fin"
                    name="dateFin"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez sélectionner une date de fin',
                        },
                    ]}
                >
                    {iconMap['dateFin']}
                </Form.Item>

                <Form.Item
                    label="Coût de l'abonnement"
                    name="coutAbonnement"
                    rules={[
                        {
                            required: true,
                            message: 'Veuillez saisir le coût de l\'abonnement',
                        },
                    ]}
                >
                    {iconMap['coutAbonnement']}
                </Form.Item>

                <Button htmlType="submit" type="primary" icon={<SaveOutlined />}> Enregistrer </Button>
            </Form>
        </Card>
    );
};

export default CreateProjet;
