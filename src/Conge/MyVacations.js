import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Tag } from 'antd';
import moment from 'moment';
import Layout from '../Layout';

const { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } = require('@ant-design/icons');

const MyVacations = () => {
    const [vacations, setVacations] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchVacations = async () => {
            if (!userId) {
                console.error('User ID not found in local storage');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/vacation/6661e46b33918c98ff1f8e9d');
                const fetchedVacations = response.data.requests.map(vacation => ({
                    ...vacation,
                    startDate: moment(vacation.startDate).format('YYYY-MM-DD'),
                    endDate: moment(vacation.endDate).format('YYYY-MM-DD')
                }));
                setVacations(fetchedVacations);
                console.log('Fetched vacations:', fetchedVacations);
            } catch (error) {
                console.error('Error fetching vacations:', error);
            }
        };

        fetchVacations();
    }, [userId]);

    const getStatusTag = (status) => {
        let color = '';
        let icon = null;
        switch (status) {
            case 'approved':
                color = '#52c41a'; // Vert
                icon = <CheckCircleOutlined />;
                break;
            case 'rejected':
                color = '#ff4d4f'; // Rouge clair
                icon = <CloseCircleOutlined />;
                break;
            case 'waiting':
                color = '#faad14'; // Orange clair
                icon = <ClockCircleOutlined />;
                break;
            default:
                color = 'default';
                break;
        }
        return <Tag color={color} icon={icon}>{status.toUpperCase()}</Tag>;
    };

    return (
        <Layout>
            <div>
                <h2 style={{ color: '#001529', marginBottom: '20px', fontWeight: 'bold' }}>My Vacations</h2>
                <Row gutter={16}>
                    {vacations.map((vacation) => (
                        <Col key={vacation._id} xs={24}>
                            <Card style={{ marginBottom: 16 }}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <p><strong>Period:</strong> {vacation.period} days</p>
                                    </Col>
                                    <Col span={8}>
                                        <p><strong>Start Date:</strong> {vacation.startDate}</p>
                                    </Col>
                                    <Col span={8}>
                                        <p><strong>End Date:</strong> {vacation.endDate}</p>
                                    </Col>
                                </Row>
                                <Row gutter={16} justify="center" style={{ marginTop: '10px' }}>
                                    <Col span={12}>
                                        <p style={{ textAlign: 'center' }}><strong>Status:</strong> {getStatusTag(vacation.status)}</p>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Layout>
    );
};

export default MyVacations;
