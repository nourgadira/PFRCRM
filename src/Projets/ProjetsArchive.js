import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { getPermissions, getTaskByUserId } from "../helpers/helpers";

import { Button, DatePicker, Form, Input, Modal, Space, Table, Upload, message, Card, Select } from 'antd';
import {
  EditOutlined, DeleteOutlined, UserOutlined, IdcardOutlined, SearchOutlined, FileOutlined, FileTextOutlined,
  CloseOutlined,
  CalendarOutlined, DollarOutlined, DownloadOutlined, SaveOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const GetAllProjet = () => {
  const [loggedInUser, setLoggedInUser] = useState({});

  const [open, setOpen] = useState(false);
  const [openResourceModal, setOpenResourceModal] = useState(false);
  const [text, setText] = useState("")
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [selectedResourceType, setSelectedResourceType] = useState('');
  const navigate = useNavigate();


  const { data, isLoading } = useQuery({
    queryKey: ['projets', text],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8080/api/projetsArchive`)
      console.log(response.data); // Add this line to check data in the console
      return response.data.projets;
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id }) => {
      await axios.delete(`http://localhost:8080/api/projet/${id}/1`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projets')
    }
  })

  const { mutate: edit, isPending: editLoading } = useMutation({
    mutationFn: async ({ id, data }) => {
      await axios.put(`http://localhost:8080/api/projet/${id}`, { ...data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projets')
      setOpen(false)
    }
  })

  const props = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };


  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date Debut',
      dataIndex: 'dateDebut',
      key: 'Date debut',
      render: (_, record) => {
        return <span>{dayjs(record.dateDebut).format('YYYY-MM-DD')}</span>
      }
    },
    {
      title: 'Date Fin',
      dataIndex: 'dateFin',
      key: 'dateFin',
      render: (_, record) => {
        return <span>{dayjs(record.dateFin).format('YYYY-MM-DD')}</span>
      }
    },
    {
      title: 'Coût',
      dataIndex: 'coutProjet',
      key: 'coutProjet',
    },

    {
      title: 'Date Hebergement',
      dataIndex: 'dateHebergement',
      key: 'dateHebergement',
      render: (_, record) => {
        return <span>{dayjs(record.dateRenouvellement).format('YYYY-MM-DD')}</span>
      }

    },
    {
      title: 'Fichier',
      render: (_, record) => {
        return <>

          <a href={`${record.file}`} target='_blank'>Fichier ...</a>
        </>

      }
    },
    {
      title: 'Dépenses',
      key: 'depenses',
      render: (_, record) => (
        <Button onClick={() => handleDepensesClick(record)}>Dépenses</Button>
      ),
    },

    {
      title: 'Client',
      dataIndex: 'clientId',
      key: 'clientId',
      render: (_, record) => {
        const clientName = record.clientId ? record.clientId.nom : '';
        return (
          <span>
            <UserOutlined style={{ marginRight: 8 }} /> {/* Icône avant le nom */}
            {clientName}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      render: (_, record) => {
        return (
          <Space>
            {/* Bouton pour modifier le projet */}
            {canAccess() && (
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue(record);
                  setOpen(true);
                }}
              />
            )}

            {/* Bouton pour supprimer le projet */}
            {canAccess() && (
              <Button
                icon={<DeleteOutlined />}
                type="primary"
                danger
                onClick={() => mutate({ id: record._id })}
                loading={isPending}
              />
            )}

          </Space>
        );
      },
    },
  ];
  const canAccess = () => {
    return getPermissions('GetAllPArchive', 'update', loggedInUser.role);
  };
  const canDelete = () => {
    return getPermissions('GetAllPArchive', 'delete', loggedInUser.role);
  };
  const archiveProjet = async (projectId) => {
    try {
      await axios.put(`http://localhost:8080/api/projets/${projectId}/archive`); // Appel à l'API pour archiver le projet
      queryClient.invalidateQueries('projets'); // Invalider la requête pour rafraîchir les données
    } catch (error) {
      console.error('Error archiving projet:', error);
      message.error('Error archiving projet');
    }
  };
  const handleDepensesClick = (record) => {
    // Logique à exécuter lorsque le bouton "Dépenses" est cliqué
    setOpenResourceModal(true); // Ouvrir le modal des ressources
  };

  const handleSelectResourceType = (type) => {
    setOpenResourceModal(false); // Fermer le modal des ressources après avoir sélectionné le type
    // Naviguer vers la page correspondante en fonction du type sélectionné
    if (type === 'materiel') {
      navigate('/RessourceM'); // Naviguer vers la page RessourceM
    } else if (type === 'financier') {
      navigate('/RessourceF'); // Naviguer vers la page RessourceF
    }
  };
  return (
    <Layout>
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">LISTE DE PROJETS ARCHIVE</h1>

      </div>
      <Form.Item>
        <Input
          placeholder="Rechercher"
          style={{ width: '200px' }}
          onChange={(e) => setText(e.target.value)}
          prefix={<SearchOutlined style={{ color: 'blue' }} />} // Icône de recherche en bleu
        />

      </Form.Item>
      <Card className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary"> &#128194; LES PROJETS ARCHIVE</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table dataSource={data} columns={columns} loading={isLoading} />
          </div>
        </div>
      </Card>
      <Modal open={open} onCancel={() => setOpen(false)} footer={false}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h4 style={{ color: 'blue' }}>
            <EditOutlined /> Modifier Projet
          </h4>
        </div>
        <Form layout="vertical" form={form} onFinish={(values) => edit({ id: values._id, data: values })}>
          <Form.Item label="Id" name="_id">
            <Input disabled prefix={<IdcardOutlined />} />
          </Form.Item>
          <Form.Item label="Nom" name="nom" rules={[{ required: true, message: 'Veuillez saisir un nom' }]}>
            <Input suffix={<FileOutlined />} />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Veuillez saisir une description' }]}>

            <Input suffix={<FileTextOutlined />} />
          </Form.Item>
          <Form.Item label="Date Début" name="dateDebut" rules={[{ required: true, message: 'Veuillez saisir une date début' }]}>
            <Input suffix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item label="Date Fin" name="dateFin" rules={[{ required: true, message: 'Veuillez saisir une date fin' }]}>
            <Input suffix={<CalendarOutlined />} />
          </Form.Item>
          <Form.Item label="Coût Projet" name="coutProjet" rules={[{ required: true, message: 'Veuillez saisir une coût projet' }]}>
            <Input suffix={<DollarOutlined />} />
          </Form.Item>

          <Form.Item label="Date Hébergement" name="dateHebergement" rules={[{ required: true, message: 'Veuillez saisir une date hébergement' }]}>
            <Input suffix={<CalendarOutlined />} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
            <Upload {...props} action={`http://localhost:8080/api/uploads?id=${form.getFieldValue('_id')}`}>
              <Button icon={<DownloadOutlined />} shape="square" style={{ marginTop: '10px' }}>Télécharger</Button>
            </Upload>
          </div>
          <Button htmlType="submit" type="primary" icon={<SaveOutlined />}>Enregistrer</Button>
        </Form>
      </Modal>
      <Modal
        title="Choisir le type de dépenses"
        visible={openResourceModal}
        onCancel={() => setOpenResourceModal(false)}
        footer={null}
      >
        <Button onClick={() => handleSelectResourceType('materiel')}>
          Matériel
        </Button>
        <Button onClick={() => handleSelectResourceType('financier')}>
          Financier
        </Button>
      </Modal>

    </Layout>
  );
};
export default GetAllProjet;