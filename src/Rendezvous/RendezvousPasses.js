import React from 'react';
import { Table, Link, Tag, Card } from 'antd';
import Layout from '../Layout';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { decodeToken } from '../lib/jwt';
import moment from 'moment';
import dayjs from 'dayjs';

const RendezvousPassesHier = () => {
    const decoded = decodeToken(localStorage.getItem('token'));

    const { data: rendezvous, isLoading } = useQuery({
        queryKey: ["rendezvous"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/rendezvous`);
            return response.data;
        }
    });

    // Filtrer les rendez-vous passés à partir d'hier
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const rendezvousPassesHier = rendezvous?.filter(rdv =>
        moment(rdv.dateHeure).isBefore(yesterday) // Utilisation de isBefore pour filtrer les rendez-vous passés hier
    );

    const columns = [
        {
            title: 'Date and Time',
            dataIndex: 'dateHeure',
            key: 'dateHeure',

            render: (text, record) => (
                <span>{dayjs(record.dateHeure).format('YYYY-MM-DD')}</span>
            ),
        },
        {
            title: 'etat Client',
            dataIndex: 'etat',
            key: 'etat',
        },
        {
            title: 'Etat',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'cancelled' ? 'red' : 'green'}>
                    {status === 'cancelled' ? 'Cancelled' : 'Active'}
                </Tag>
            ),
        },
        {
            title: 'prenom client',
            dataIndex: 'prenomclient',
            key: 'prenomclient',
        },
        {
            title: 'nom client',
            dataIndex: 'nomclient',
            key: 'nomclient',
        },
        {
            title: 'notes',
            dataIndex: 'notes',
            key: 'notes',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Location',
            dataIndex: 'lieu',
            key: 'lieu',
        },

    ];

    return (
        <Layout>
            <Card className="shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary"> LES rendezvous passées </h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table dataSource={rendezvousPassesHier} columns={columns} loading={isLoading} />
                    </div>
                </div>
            </Card>

        </Layout>
    );
};

export default RendezvousPassesHier;
