import React, { useState, useEffect } from 'react';
import { Table, Tag, Card } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Layout from '../Layout';
import { Link } from 'react-router-dom'; // Importez Link et useParams

const DetailsAvance = () => {
    const { projetId } = useParams();
    const { montantPaiement } = useParams();
    const [avances, setAvances] = useState([]);
    const [totalAvances, setTotalAvances] = useState(0);
    const [resteAPayer, setResteAPayer] = useState(0);

    useEffect(() => {
        const fetchAvances = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/avances/${projetId}`);
                const data = response.data;
                setAvances(data);

                // Calculate totals
                let totalAvance = 0;

                data.forEach(avance => {
                    totalAvance += parseFloat(avance.avance) || 0;
                });

                setTotalAvances(totalAvance);
                setResteAPayer(parseFloat(montantPaiement) - totalAvance);

            } catch (error) {
                console.error('Erreur lors de la récupération des avances:', error);
            }
        };

        fetchAvances();
    }, [projetId, montantPaiement]);

    const columns = [
        {
            title: 'Avance',
            dataIndex: 'avance',
            key: 'avance',
        },

        {
            title: 'Date d\'avance',
            dataIndex: 'dateavance',
            key: 'dateavance',
            render: (text, record) => (
                <span>{dayjs(record.dateavance).format('YYYY-MM-DD')}</span>
            ),
        },
    ];

    const isPaid = resteAPayer === 0;
    const cardStyle = {
        width: 300,
        margin: '20px auto',
        textAlign: 'center',
        fontWeight: 'bold',
    };

    return (
        <Layout>


            <Table
                dataSource={avances}
                columns={columns}
                pagination={false}
                rowKey={(record) => record._id}
                size="small"
            />
            <div style={{ width: '80%', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center' }}>Total des Avances: {totalAvances.toFixed(2)}</h2>
                <h2 style={{ textAlign: 'center' }}>Montant du Paiement: {montantPaiement}</h2>
                <h2 style={{ textAlign: 'center' }}>Reste à Payer: {resteAPayer.toFixed(2)}</h2>
            </div>
            <Card style={isPaid ? { ...cardStyle, color: 'green' } : cardStyle}>
                {isPaid ? 'Payée' : 'En attente de paiement'}
            </Card>
        </Layout>
    );
};

export default DetailsAvance;