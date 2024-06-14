import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Table, Card } from 'antd';
import { axiosInstance } from '../lib/axios';
import Layout from '../Layout';

const CreateBudget = ({ projectId }) => {
    const [depense, setDepense] = useState('');
    const [prix, setPrix] = useState('');
    const [budgets, setBudgets] = useState([]);
    const [totalDepenses, setTotalDepenses] = useState(0);

    const handleAddBudget = async () => {
        try {
            const response = await axiosInstance.post(`/projets/tnd{projectId}/budgets`, { depense, prix });
            const newBudget = response.data;
            setBudgets([...budgets, newBudget]);
            setDepense(''); // Réinitialiser les champs après l'ajout
            setPrix('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du budget :', error);
        }
    };

    // Fonction pour récupérer les budgets
    const fetchBudgets = async () => {
        try {
            const response = await axiosInstance.get(`/projets/664efb339eed28edf1e9befe/budgets`);
            setBudgets(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des budgets :', error);
        }
    };

    // Calculer le total des dépenses
    const calculateTotalDepenses = (budgets) => {
        const total = budgets.reduce((acc, budget) => acc + parseFloat(budget.prix), 0);
        setTotalDepenses(total);
    };

    useEffect(() => {
        fetchBudgets(); // Appel de fetchBudgets une fois que le composant est monté
    }, []); // Le tableau vide [] assure que useEffect est exécuté une seule fois à l'initialisation

    useEffect(() => {
        calculateTotalDepenses(budgets);
    }, [budgets]);

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

            <Card style={{ marginTop: '20px', width: '500px', height: '400px', margin: '0 auto', borderLeft: '5px solid blue', borderRight: '5px solid blue' }}>
                <div>
                    <h3 style={{ textAlign: 'center' }}>Ajouter Budget</h3>
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



            {/* Section pour afficher les budgets ajoutés */}
            <div>
                <Card>
                    <h3>Budgets ajoutés</h3>
                    <Table
                        dataSource={budgets}
                        columns={columns}
                        style={{
                            marginTop: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '100%', // Définir une largeur de 80% par exemple
                            height: '200px', // Définir une hauteur de 200px par exemple
                            overflow: 'auto' // Ajouter un défilement si nécessaire
                        }}
                    />

                </Card>    {/* Card pour afficher le total des dépenses */}
            </div>

        </Layout >
    );
};

export default CreateBudget;
