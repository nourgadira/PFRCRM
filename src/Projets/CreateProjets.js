import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../Layout';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Button, DatePicker, Form, Input, Select, Card, Avatar, Typography, Upload, message } from "antd"; // Importez Avatar, Typography, Upload et message

import { FolderAddOutlined, CalendarOutlined, EuroOutlined, UserOutlined, FileTextOutlined, SaveOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const CreateProjet = ({ clientId }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm()

  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await axiosInstance.get('/clients')
      return response.data
    },
    select: (data) => {
      return data.flatMap((d) => {
        return {
          label: d.nom,
          value: d._id
        }
      })
    }
  })

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users');
      return response.data.filter((d) => d.role === 2).map((d) => ({
        label: <div style={{ display: 'flex', alignItems: 'center' }}><Avatar src={d.image} style={{ width: "50px", height: "50px" }} /><Typography.Title level={5} style={{ marginLeft: '8px' }}>{d.name}</Typography.Title></div>,
        value: d._id,
      }));
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data }) => {
      try {
        const response = await axiosInstance.post(`/projets`, { ...data, clientId });
        console.log('Réponse de la requête POST reçue depuis le serveur :', response.data);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la requête POST vers /api/projets :', error);
        throw new Error('Erreur lors de la requête POST vers /api/projets');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('projets');
      navigate('/Projets');
    }
  });

  const iconMap = {
    nom: <UserOutlined />,
    description: <FileTextOutlined />,
    dateDebut: <CalendarOutlined />,
    dateFin: <CalendarOutlined />,
    coutProjet: <EuroOutlined />,
    dateRenouvellement: <CalendarOutlined />,
    dateHebergement: <CalendarOutlined />
  };

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

  return (
    <Card title={<><FolderAddOutlined /> Créer un projet</>} className="mb-4">
      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => mutate({ data: values })}
      >
        <Form.Item
          label="Nom"
          name="nom"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir un nom',
            },
          ]}
        >
          <Input suffix={iconMap['nom']} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir une description',
            },
          ]}
        >
          <Input.TextArea suffix={iconMap['description']} />
        </Form.Item>
        <Form.Item
          label="Date Debut"
          name="dateDebut"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir une date de début',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const dateFinValue = getFieldValue('dateFin');
                if (!dateFinValue || value < dateFinValue) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('La date de début doit être antérieure à la date de fin'));
              },
            }),
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Date Fin"
          name="dateFin"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir une date de fin',
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
          {(_, record) => (
            <>
              <span>{dayjs(record.dateFin).format('YYYY-MM-DD')}</span>
              <DatePicker style={{ width: '100%' }} />
            </>
          )}
        </Form.Item>
        <Form.Item
          label="Coût Projet"
          name="coutProjet"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir un coût de projet',
            },
            {
              pattern: /^[0-9]+$/,
              message: 'Veuillez saisir uniquement des chiffres',
            },
          ]}
        >
          <Input suffix={iconMap['coutProjet']} />
        </Form.Item>

        <Form.Item
          label="Date Hébergement"
          name="dateHebergement"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir une date d\'hébergement',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const dateFinValue = getFieldValue('dateFin');
                if (!dateFinValue || value > dateFinValue) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('La date d\'hébergement doit être postérieure à la date de fin du projet'));
              },
            }),
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Chef de projet"
          name="chefProjet"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir un chef de projet',
            },
          ]}
        >
          <Select options={users} />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
          <Upload {...props} action={`http://localhost:8080/api/uploads?id=${form.getFieldValue('_id')}`}>
            <Button icon={<DownloadOutlined />} shape="square" style={{ marginTop: '10px' }}>Téléverser</Button>
          </Upload>
        </div>
        <Button htmlType="submit" type="primary" icon={<SaveOutlined />}> Enregistrer </Button>
      </Form>
    </Card>


  );
};

export default CreateProjet;
