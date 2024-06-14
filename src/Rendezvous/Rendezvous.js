import React, { useState } from 'react';
import { Table, Button, message, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import moment from 'moment';
import { Card } from 'antd';
import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';

const AllRendezvous = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: rendezvous, isLoading } = useQuery({
    queryKey: ["rendezvous"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/rendezvous`);
      return response.data;
    }
  });

  const today = moment().startOf('day');

  const annulerRendezvous = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/rendezvous/${id}`);
      queryClient.invalidateQueries('rendezvous');
      message.success('Rendez-vous annulé avec succès');
    } catch (error) {
      message.error('Erreur lors de l\'annulation du rendez-vous');
    } finally {
      setLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Date and Time',
      dataIndex: 'dateHeure',
      key: 'dateHeure',
      render: (text, record) => (
        <span>{dayjs(record.dateHeure).format('YYYY-MM-DD')}</span>
      ),
    },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Location', dataIndex: 'lieu', key: 'lieu' },
    { title: 'Etat Client', dataIndex: 'etat', key: 'etat' },
    { title: 'Nom Client', dataIndex: 'nomclient', key: 'nomclient' },
    { title: 'Prenom Client', dataIndex: 'prenomclient', key: 'prenomclient' },
    { title: 'Notes', dataIndex: 'notes', key: 'notes' },
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
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Link to={`/ModifierRendezvous/${record._id}`}>Modifier</Link>
          {record.status === 'cancelled' ? (
            <Button type="link" disabled style={{ color: 'red' }}>
              Annuler
            </Button>
          ) : (
            <Button
              type="link"
              onClick={() => annulerRendezvous(record._id)}
              style={{ color: 'red' }}
            >
              Annuler
            </Button>
          )}
        </span>
      ),
    },
  ];

  // Filtrer les rendez-vous passés
  const rendezvousFuturs = rendezvous?.filter(rendezvous => moment(rendezvous.dateHeure).isAfter(today));

  return (
    <Layout>
      <Card className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary"> &#128194; LES rendezvous</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table dataSource={rendezvousFuturs} columns={columns} loading={isLoading} />
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default AllRendezvous;
