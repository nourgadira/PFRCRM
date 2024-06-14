import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Select, DatePicker, message, Card } from 'antd';
import moment from 'moment';
import Layout from "../Layout";
import { useNavigate } from 'react-router-dom';
import {
    CalendarOutlined,
    ScheduleOutlined,
    FileDoneOutlined,
} from '@ant-design/icons';

const { Option } = Select;

const RequestVacation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        period: '',
        startDate: '',
        endDate: '',
        type: ''
    });
    const [remainingDays, setRemainingDays] = useState(null);
    const [isValidRequest, setIsValidRequest] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchRemainingDays = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) throw new Error('User ID not found in local storage');

                const response = await axios.get(`http://localhost:8080/api/users/6661e46b33918c98ff1f8e9d/remainingDays`);
                setRemainingDays(response.data.remainingDays);
            } catch (error) {
                console.error('Error fetching remaining days:', error.message);
                message.error('Failed to fetch remaining vacation days');
            }
        };

        fetchRemainingDays();
    }, []);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        setIsValidRequest(true);

        if (name === 'startDate') {
            const today = moment().format('YYYY-MM-DD');
            if (value < today) {
                setErrorMessage('Start date must be today or later');
            } else {
                setErrorMessage('');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const today = moment().format('YYYY-MM-DD');
            if (formData.startDate < today) {
                message.error('Start date must be today or later');
                return;
            }

            if (!isValidRequest) {
                message.error('You are requesting more days than your remaining vacation days.');
                return;
            }

            const userId = localStorage.getItem('userId');
            if (!userId) throw new Error('User ID not found in local storage');

            const requestData = { ...formData, userId };
            const response = await axios.post('http://localhost:8080/api/vacation', requestData);

            console.log('Vacation request created:', response.data);
            message.success('Vacation request created successfully');
            navigate('/MyVacations');
        } catch (error) {
            console.error('Error creating vacation request:', error.message);
        }
    };

    const calculatePeriod = () => {
        const { startDate, endDate } = formData;

        if (startDate && endDate && startDate < endDate) {
            const startMoment = moment(startDate, 'YYYY-MM-DD');
            const endMoment = moment(endDate, 'YYYY-MM-DD');
            const days = endMoment.diff(startMoment, 'days') + 1;

            if (days >= 0) {
                setFormData({ ...formData, period: days });
                setIsValidRequest(days <= remainingDays);
            } else {
                setIsValidRequest(false);
                message.error('End date must be after the start date');
            }
        } else {
            setIsValidRequest(false);
            message.error('Please select valid start and end dates');
        }
    };

    return (
        <Layout>
            <div className="request-vacation-container">
                <Card title="Request for a Vacation" bordered={false} style={{ maxWidth: 800, margin: '0 auto' }}>
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Period (in days)" icon={<ScheduleOutlined />}>
                            <Input
                                prefix={<ScheduleOutlined />}
                                name="period"
                                value={formData.period}
                                onChange={(e) => handleChange('period', e.target.value)}
                                readOnly
                            />
                        </Form.Item>
                        <Form.Item label="Start Date" validateStatus={errorMessage ? 'error' : ''} help={errorMessage}>
                            <DatePicker
                                prefix={<CalendarOutlined />}
                                format="YYYY-MM-DD"
                                value={formData.startDate ? moment(formData.startDate) : null}
                                onChange={(date, dateString) => {
                                    handleChange('startDate', dateString);
                                    calculatePeriod();
                                }}
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current < moment().startOf('day')}
                                required
                            />
                        </Form.Item>
                        <Form.Item label="End Date">
                            <DatePicker
                                prefix={<CalendarOutlined />}
                                format="YYYY-MM-DD"
                                value={formData.endDate ? moment(formData.endDate) : null}
                                onChange={(date, dateString) => {
                                    handleChange('endDate', dateString);
                                    calculatePeriod();
                                }}
                                style={{ width: '100%' }}
                                required
                            />
                        </Form.Item>
                        <Form.Item label="Type of Vacation">
                            <Select
                                prefix={<FileDoneOutlined />}
                                name="type"
                                value={formData.type}
                                onChange={(value) => handleChange('type', value)}
                                style={{ width: '100%' }}
                                required
                            >
                                <Option value="Maternity Leave">Maternity Leave</Option>
                                <Option value="Paternity Leave">Paternity Leave</Option>
                                <Option value="Bereavement Leave">Bereavement Leave</Option>
                                <Option value="Personal Leave">Personal Leave</Option>
                                <Option value="Other">Other</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={!isValidRequest || !!errorMessage} style={{ width: '100%' }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    {remainingDays !== null && (
                        <div className="remaining-days" style={{ color: remainingDays <= 2 ? 'red' : 'inherit', textAlign: 'center', fontSize: '16px', marginTop: '10px' }}>
                            <p>You have {remainingDays} days of vacation left.</p>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default RequestVacation;