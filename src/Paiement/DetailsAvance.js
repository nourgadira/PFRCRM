import React, { useState, useEffect } from 'react';
import { Table, Card, Divider, Statistic, Row, Col } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Layout from '../Layout';

const DetailsAvance = () => {
    const { projetId, montantPaiement } = useParams();
    const [avances, setAvances] = useState([]);
    const [totalAvances, setTotalAvances] = useState(0);
    const [resteAPayer, setResteAPayer] = useState(0);

    useEffect(() => {
        const fetchAvances = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/avances/${projetId}`);
                const data = response.data;
                setAvances(data);

                // Calculate total avances and remaining payment
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
            render: text => `TND ${parseFloat(text).toFixed(2)}`,
        },
        {
            title: "Date d'Avance",
            dataIndex: 'dateavance',
            key: 'dateavance',
            render: (text, record) => (
                <span>{dayjs(record.dateavance).format('YYYY-MM-DD')}</span>
            ),
        },
        {
            title: "typeavance",
            dataIndex: 'typeavance',
            key: 'typeavance',

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
            <Card className="shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary"> &#128194; LES AVANCES DE CHAQUE PROJET</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table
                            dataSource={avances}
                            columns={columns}
                            pagination={false}
                            rowKey={(record) => record._id}
                            size="small"
                        />
                    </div>
                </div>
            </Card>

            <Row gutter={16} style={{ width: '80%', margin: '0 auto' }}>
                <Col span={8}>
                    <Statistic title="Total des Avances" value={`TND${totalAvances.toFixed(2)}`} />
                </Col>
                <Col span={8}>
                    <Statistic title="Montant du Paiement" value={`TND ${parseFloat(montantPaiement).toFixed(2)}`} />
                </Col>
                <Col span={8}>
                    <Statistic title="Reste à Payer" value={`TND ${resteAPayer.toFixed(2)}`} valueStyle={{ color: isPaid ? 'green' : 'red' }} />
                </Col>
            </Row>

            <Divider />

        </Layout>
    );
};

export default DetailsAvance;
