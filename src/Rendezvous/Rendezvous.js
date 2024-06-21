import React, { useState } from 'react';
import { Table, Button, message, Modal, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import moment from 'moment';
import { Card } from 'antd';
import dayjs from 'dayjs';

const AllRendezvous = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [cancelRendezvousId, setCancelRendezvousId] = useState(null);

  const { data: rendezvous, isLoading } = useQuery({
    queryKey: ["rendezvous"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/rendezvous`);
      return response.data;
    }
  });

  const today = moment().startOf('day');

  const handleCancelRendezvous = (rendezvousId) => {
    setCancelRendezvousId(rendezvousId);
    setConfirmModalVisible(true);
  };

  const confirmCancelRendezvous = async () => {
    try {
      await axiosInstance.put(`/rendezvous/${cancelRendezvousId}/cancel`, { status: 'cancelled' });
      message.success('Rendez-vous annulé avec succès.');
      queryClient.invalidateQueries(["rendezvous"]);
    } catch (error) {
      message.error('Erreur lors de l\'annulation du rendez-vous.');
    }
    setConfirmModalVisible(false);
  };

  const cancelConfirmCancelRendezvous = () => {
    setConfirmModalVisible(false);
  };

  const getStatusTag = (status, dateFin) => {
    if (!status) {
      return null;
    }

    let color = '';
    switch (status) {

      case 'En cours':
        color = '#52c41a'; // Vert
        break;
      case 'cancelled':
        color = '#f5222d'; // Rouge
        break;
      case 'À Fait':
        color = '#fadb14'; // Jaune
        break;
      default:
        color = '#d9d9d9'; // Gris par défaut pour les statuts non définis
        break;
    }

    const daysOverdue = getDaysOverdue(dateFin);
    const statusText = daysOverdue > 0 ? `${status.toUpperCase()} (${daysOverdue} jours de retard)` : status.toUpperCase();
    return <Tag color={color}>{statusText}</Tag>;
  };
  const getDaysOverdue = (dateFin) => {
    const endDate = moment(dateFin);
    const daysDiff = endDate.diff(today, 'days');
    return daysDiff;
  };
  const columns = [
    {
      title: 'Date et Heure',
      dataIndex: 'dateHeure',
      key: 'dateHeure',
      render: (text, record) => (
        <span>{dayjs(record.dateHeure).format('YYYY-MM-DD')}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => getStatusTag(record.status, record.dateFin),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Langue',
      dataIndex: 'langue',
      key: 'langue',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Nom Client',
      dataIndex: 'nomclient',
      key: 'nomclient',
    },
    {
      title: 'Prénom Client',
      dataIndex: 'prenomclient',
      key: 'prenomclient',
    },
    {
      title: 'Lieu',
      dataIndex: 'lieu',
      key: 'lieu',
    },
    {
      title: 'État',
      dataIndex: 'etat',
      key: 'etat',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Link to={`/ModifierRendezvous/${record._id}`}>Modifier</Link>
          <Button type="link" onClick={() => handleCancelRendezvous(record._id)}>Annuler</Button>
        </span>
      ),
    },
  ];

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
      <Modal
        title="Confirmer l'annulation"
        visible={confirmModalVisible}
        onOk={confirmCancelRendezvous}
        onCancel={cancelConfirmCancelRendezvous}
      >
        Êtes-vous sûr de vouloir annuler ce rendez-vous ?
      </Modal>
    </Layout>
  );
};

export default AllRendezvous;
