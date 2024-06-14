import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout';
import { message, Typography, Table, Tag, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

const ReviewOfVacations = () => {
    const [approvedVacations, setApprovedVacations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        fetchApprovedVacations();
    }, []);

    const fetchApprovedVacations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/vacationRequests?status=approved');
            setApprovedVacations(response.data);
        } catch (error) {
            console.error('Error fetching approved vacations:', error.message);
            message.error('Failed to fetch approved vacations');
        }
    };

    const calculateConsumedVacationDays = (userId) => {
        const userVacations = approvedVacations.filter(vacation => vacation.userId && vacation.userId._id === userId);
        return userVacations.reduce((totalDays, vacation) => {
            return totalDays + parseInt(vacation.period, 10);
        }, 0);
    };

    const calculateRemainingVacationDays = (userId) => {
        const totalAllowedDays = 21; // Suppose a total of 21 vacation days allowed
        return totalAllowedDays - calculateConsumedVacationDays(userId);
    };

    const groupUsers = () => {
        const groupedUsers = {};
        approvedVacations.forEach(vacation => {
            const user = vacation.userId;
            if (user && user._id) {
                if (!groupedUsers[user._id]) {
                    groupedUsers[user._id] = {
                        key: user._id,
                        name: user.name,
                        consumedDays: calculateConsumedVacationDays(user._id),
                        remainingDays: calculateRemainingVacationDays(user._id),
                    };
                }
            }
        });
        return Object.values(groupedUsers);
    };

    const data = groupUsers();

    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = data.filter(user =>
            user.name && user.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <Title level={2} style={{ color: 'black', marginBottom: '20px', fontWeight: 'bold' }}><UserOutlined style={{ marginRight: '8px', fontSize: '24px' }} />
                    Employees Vacation Review</Title>
                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <Search
                        placeholder="Search "
                        allowClear
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 200 }}
                    />
                </div>
                <Table
                    columns={[
                        {
                            title: 'Employee Name',
                            dataIndex: 'name', // Utilisez la propriété 'name' pour afficher le nom de l'employé
                            key: 'name',
                            style: { background: '#f7f7f7' },
                        },
                        {
                            title: 'Consumed Vacation Days',
                            dataIndex: 'consumedDays',
                            key: 'consumedDays',
                            render: (text) => text === 0 ? '' : text,
                            style: { background: '#f7f7f7' },
                        },
                        {
                            title: 'Remaining Vacation Days',
                            dataIndex: 'remainingDays',
                            key: 'remainingDays',
                            render: (text) => (
                                <span>
                                    {text === 0 ? '0' : text}
                                    {text === 0 && <Tag color="red" style={{ marginLeft: '8px', fontWeight: 'bold', color: 'white', background: 'red' }}>Total Days Consumed</Tag>}
                                </span>
                            ),
                            style: { background: '#f7f7f7' },
                        },
                    ]}
                    dataSource={searchTerm ? filteredUsers : data}
                    pagination={{ position: ['bottomRight'] }}
                />
                {data.some(user => user.remainingDays === 0) && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Tag color="red" style={{ fontWeight: 'bold', color: 'white', background: 'red' }}>Some users have consumed all their vacation days</Tag>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ReviewOfVacations;
