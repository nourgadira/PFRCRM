import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { UploadOutlined } from '@ant-design/icons';
import { TableOutlined, AppstoreOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import { Button, DatePicker, Form, Input, Modal, Space, Table, Upload, message, Card, Select, Flex, Row, Col, Tag } from 'antd';
import {
  EditOutlined, DeleteOutlined, UserOutlined, IdcardOutlined, SearchOutlined, FileOutlined, FileTextOutlined,
  CloseOutlined,
  CalendarOutlined, DollarOutlined, DownloadOutlined, SaveOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import moment from 'moment';
import { getPermissions, getTaskByUserId } from "../helpers/helpers";

import { CardProjet } from './CardProjet';
import { decodeToken } from '../lib/jwt';
import { axiosInstance } from '../lib/axios';
const GetAllProjet = ({ projetData, _id }) => {
  const [open, setOpen] = useState(false);
  const [openResourceModal, setOpenResourceModal] = useState(false); // Utilisation de useState à l'intérieur du composant
  const [text, setText] = useState("")
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const [projetsList, setProjetList] = useState(false)
  const decoded = decodeToken(localStorage.getItem("token"))

  const tableau = (status) => {
    setProjetList(status)
  }

  const { data, isLoading } = useQuery({
    queryKey: ['projets', text],
    queryFn: async () => {
      const response = await axiosInstance.get(`/projets?name=${text}`);
      return response.data.projets;
    },
    select: (data) => decoded.role === 0 ? data : data.filter(p => p.chefProjet._id === decoded.id)
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id }) => {
      await axiosInstance.delete(`/projet/${id}/1`);
      message.success("projet est archivé avec succès");
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projets');
    }
  });
  const canAccess = () => {
    return getPermissions('projets', 'create', decoded?.role);
  };

  const canread = () => {
    return getPermissions('projets', 'payer', decoded?.role);
  };

  const { mutate: edit, isPending: editLoading } = useMutation({

    mutationFn: async ({ id, data }) => {
      await axiosInstance.put(`/projet/${id}`, { ...data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projets')
      setOpen(false)
      message.success("Projet modifié avec succès");
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
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirmation',
      content: 'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: () => mutate({ id }),
    });
  };
  const [projectId, setProjectId] = useState(/* valeur initiale de l'ID de projet */);


  const columns = [
    {
      title: 'État',
      dataIndex: 'etat',
      key: 'etat',
      render: (etat) => (
        <span style={{ color: etat === 'en cours' ? 'green' : 'red' }}>
          {etat === 'en cours' ? '❌' : '✔️'}
        </span>
      ),
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (_, record) => {
        const userRole = decoded?.role;
        const isChefProjet = userRole === 2; // Vérifie si l'utilisateur est chef de projet
        const isDeveloppeur = userRole === 1; // Vérifie si l'utilisateur est développeur
        const canAccessLink = isChefProjet || isDeveloppeur; // Vérifie si l'utilisateur peut accéder au lien

        if (canAccessLink) {
          return <Link to={`/projets/${record._id}/taches`}>{record.nom}</Link>;
        } else {
          return record.nom;
        }
      }
    },

    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date Début',
      dataIndex: 'dateDebut',
      key: 'dateDebut',
      render: (_, record) => (
        <span>{dayjs(record.dateDebut).format('YYYY-MM-DD')}</span>
      ),
    },
    {
      title: 'Date Fin',
      dataIndex: 'dateFin',
      key: 'dateFin',
      render: (_, record) => {
        const sevenDaysFromNow = moment().add(7, 'days');
        const isWithinSevenDays = moment(record.dateFin).isBefore(sevenDaysFromNow);

        let tagColor = ''; // Couleur par défaut
        if (isWithinSevenDays) {
          tagColor = '#ff4d4f'; // Couleur foncée (rouge foncé) pour les dates dans les 7 jours
        } else {
          tagColor = 'default'; // Couleur par défaut pour les autres dates
        }

        return (
          <Tag color={tagColor}>
            {dayjs(record.dateFin).format('YYYY-MM-DD')}
          </Tag>
        );
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

          <a href={`${record.file}`} target='_blank'><Button type='primary' size='middle' ghost icon={<UploadOutlined />}></Button></a>
        </>

      }
    },

    {
      title: 'Dépenses',
      key: 'depenses',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/CreateBudget/${record._id}`)}>Ajouter Budget</Button>
      )
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
      title: 'chef de projet',
      dataIndex: 'chefProjet',
      key: 'chefProjet',
      render: (_, record) => {
        const chefProjet = record.chefProjet ? record.chefProjet.name : '';
        return (
          <span>
            <UserOutlined style={{ marginRight: 8 }} /> {/* Icône avant le nom */}
            {chefProjet}
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
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                form.setFieldsValue(record);
                setOpen(true);
              }}
            />
            {/* Bouton pour supprimer le projet */}
            <Button
              icon={<CloseOutlined />}
              type="primary"
              danger
              onClick={() => handleArchive(record._id)}
              loading={isPending}
            >
              Archiver
            </Button>

            <Button icon={<DollarOutlined />} onClick={() => handlePaymentClick(record._id)}>
              Payer
            </Button>


            <Button icon={<DollarOutlined />} onClick={() => handleRisques(record._id)}>
              risques
            </Button>
          </Space>


        );
      },
    },
  ];

  const handleArchive = (id) => {
    if (decoded.role === 0) {
      Modal.confirm({
        title: 'Confirmation',
        content: 'Êtes-vous sûr de vouloir archiver ce projet ?',
        okText: 'Oui',
        okType: 'danger',
        cancelText: 'Annuler',
        onOk: () => mutate({ id }),
      });
    } else {
      message.error("Vous n'êtes pas autorisé à effectuer cette action.");
    }
  };

  const handlePaymentClick = (id) => {
    if (decoded.role === 0) {
      navigate(`/CreatePaiememnt/${id}`);
    } else {
      message.error("Vous n'êtes pas autorisé à effectuer cette action.");
    }
  };
  const handleRisques = (id) => {

    navigate(`/CreateRisque/${id}`);

  };



  // operteur ternaire si vrai si
  const $DATA = !projetsList ? (
    <Card className="shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary"> &#128194; LES PROJETS</h6>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <Table dataSource={data} columns={columns} loading={isLoading} />
        </div>
      </div>
    </Card>
  ) : (
    <Row gutter={[16, 16]}>
      {data?.map(projet => (
        <Col span={24} key={projet._id}>
          <CardProjet {...projet} />
        </Col>
      ))}
    </Row>
  );


  return (
    <Layout>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">LISTE DE PROJETS</h1>
      </div>
      <Flex>
        <Button onClick={() => tableau(!projetsList)}>
          {projetsList ? <TableOutlined /> : <AppstoreOutlined />}
        </Button>      </Flex>
      <Form.Item>
        <Input
          placeholder="Rechercher"
          style={{ width: '200px' }}
          onChange={(e) => setText(e.target.value)}
          prefix={<SearchOutlined style={{ color: 'blue' }} />} // Icône de recherche en bleu
        />

      </Form.Item>
      {/* displat table and grid */}
      {$DATA}
      {/* displat table and grid */}

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
          <Input
            suffix={<CalendarOutlined />}
            value={form.getFieldValue('dateDebut') ? new Date(form.getFieldValue('dateDebut')).toISOString().split('T')[0] : ''}
          />
          <Input
            suffix={<CalendarOutlined />}
            value={form.getFieldValue('dateFin') ? new Date(form.getFieldValue('dateFin')).toISOString().split('T')[0] : ''}
          />

          <Form.Item label="Coût Projet" name="coutProjet" rules={[{ required: true, message: 'Veuillez saisir une coût projet' }]}>
            <Input suffix={<DollarOutlined />} />
          </Form.Item>

          <Input
            suffix={<CalendarOutlined />}
            value={form.getFieldValue('dateHebergement') ? new Date(form.getFieldValue('dateHebergement')).toISOString().split('T')[0] : ''}
          />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
            <Upload {...props} action={`http://localhost:8080/api/uploads?id=${form.getFieldValue('_id')}`}>
              <Button icon={<DownloadOutlined />} shape="square" style={{ marginTop: '10px' }}>Téléverser</Button>
            </Upload>
          </div>
          <Button htmlType="submit" type="primary" icon={<SaveOutlined />}>Enregistrer</Button>
        </Form>
      </Modal>




    </Layout>
  );
};
export default GetAllProjet;