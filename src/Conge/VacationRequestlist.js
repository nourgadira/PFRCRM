import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Space, message, Avatar, Modal } from 'antd';
import moment from 'moment';
import Layout from '../Layout';
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons'; // Import de l'icône InboxOutlined

const { confirm } = Modal;

const VacationRequestsList = () => {
    const [vacationRequests, setVacationRequests] = useState([]);

    useEffect(() => {
        fetchVacationRequests();
    }, []);

    const fetchVacationRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vacationRequests?status=waiting');
            const formattedRequests = response.data.map(request => ({
                ...request,
                startDate: moment(request.startDate).format('DD-MM-YYYY'),
                endDate: moment(request.endDate).format('DD-MM-YYYY'),
                createdAt: moment(request.createdAt).format('DD-MM-YYYY HH:mm:ss') // Formatage de la date de création
            }));
            formattedRequests.sort((a, b) => moment(a.createdAt) - moment(b.createdAt)); // Tri par date de création croissante
            setVacationRequests(formattedRequests);
        } catch (error) {
            console.error('Error fetching vacation requests:', error.message);
            message.error('Failed to fetch vacation requests');
        }
    };

    const showConfirm = (action, requestId) => {
        confirm({
            title: `Are you sure you want to ${action.toLowerCase()} this request?`,
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            onOk() {
                if (action === 'Approve') {
                    handleApprove(requestId);
                } else if (action === 'Reject') {
                    handleReject(requestId);
                }
            },
        });
    };
    const handleApprove = async (requestId) => {
        try {
            await axios.patch('http://localhost:8080/api/vacationRequests/6661f7144d5edc86d237e808/approve');
            message.success('Request approved successfully');
            setVacationRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error approving request:', error.message);
            message.error('Failed to approve request');
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.patch('http://localhost:8080/api/vacationRequests/6661f7144d5edc86d237e808/reject');
            message.success('Request rejected successfully');
            setVacationRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error rejecting request:', error.message);
            message.error('Failed to reject request');
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'userId',
            key: 'image',
            render: (userId) => (
                <Avatar src={userId?.image} />
            )
        },
        {
            title: 'Employee Name',
            dataIndex: ['userId', 'name'],
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: ['userId', 'email'],
            key: 'email'
        },
        {
            title: 'Period (in days)',
            dataIndex: 'period',
            key: 'period'
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate'
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => showConfirm('Approve', record._id)} style={{ background: '#52c41a', borderColor: '#52c41a' }}>Approve</Button>
                    <Button type="danger" onClick={() => showConfirm('Reject', record._id)} style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}>Reject</Button>
                </Space>
            )
        }
    ];

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <h2 style={{ color: '#001529', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
                    <InboxOutlined style={{ marginRight: '8px', fontSize: '24px' }} />
                    Vacation Requests List
                </h2>
                <Table columns={columns} dataSource={vacationRequests} rowKey="_id" />
            </div>
        </Layout>
    );
};

export default VacationRequestsList;