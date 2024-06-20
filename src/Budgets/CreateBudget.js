import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Table, Card } from 'antd';
import { axiosInstance } from '../lib/axios';
import Layout from '../Layout';
import { useParams } from 'react-router-dom';

const CreateBudget = () => {
    const [depense, setDepense] = useState('');
    const [prix, setPrix] = useState('');
    const [budgets, setBudgets] = useState([]);
    const [totalDepenses, setTotalDepenses] = useState(0);
    const [refreshBudgets, setRefreshBudgets] = useState(false);
    const { projectId } = useParams();

    const handleAddBudget = async () => {
        try {
            const response = await axiosInstance.post(`/projets/${projectId}/budgets`, { depense, prix });
            const newBudget = response.data;
            setBudgets([...budgets, newBudget]);
            setDepense('');
            setPrix('');
            setRefreshBudgets(true);
        } catch (error) {
            console.error('Erreur lors de l\'ajout du budget :', error);
        }
    };

    const fetchBudgets = async () => {
        try {
            const response = await axiosInstance.get(`/projets/${projectId}/budgets`);
            setBudgets(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des budgets :', error);
        }
    };

    const calculateTotalDepenses = (budgets) => {
        const total = budgets.reduce((acc, budget) => acc + parseFloat(budget.prix), 0);
        setTotalDepenses(total);
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    useEffect(() => {
        calculateTotalDepenses(budgets);
    }, [budgets]);

    useEffect(() => {
        if (refreshBudgets) {
            fetchBudgets();
            setRefreshBudgets(false);
        }
    }, [refreshBudgets]);

    const columns = [
        { title: 'Dépense', dataIndex: 'depense', key: 'depense' },
        { title: 'Prix', dataIndex: 'prix', key: 'prix' },
    ];

    return (
        <Layout>
            <Card style={{ marginTop: '20px', width: '300px', margin: '0 auto', borderLeft: '5px solid blue', borderRight: '5px solid blue' }}>
                <p style={{ fontWeight: 'bold', textAlign: 'center' }}>Total des dépenses</p>
                <p style={{ textAlign: 'center' }}>{totalDepenses.toFixed(2)} TND</p>
            </Card>

            <div style={{ marginTop: '20px' }}>
                {/* Ajoutez un espace de 20px */}
            </div>

            <Card style={{ marginTop: '20px', width: '500px', height: '400px', margin: '20px auto', borderLeft: '5px solid blue', borderRight: '5px solid blue' }}>
                <div>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajouter Budget</h3>
                    <Form layout="vertical">
                        <Form.Item label="Dépense">
                            <Input value={depense} onChange={(e) => setDepense(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Prix">
                            <Input value={prix} onChange={(e) => setPrix(e.target.value)} />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button type="primary" onClick={handleAddBudget}>
                                Ajouter
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>

            <div style={{ marginTop: '20px', width: '80%', margin: '0 auto' }}>
                <Card>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Budgets ajoutés</h3>
                    <Table
                        dataSource={budgets}
                        columns={columns}
                        pagination={{ pageSize: 5 }} // Ajoutez la pagination si nécessaire
                    />
                </Card>
            </div>
        </Layout>
    );
};

export default CreateBudget;
