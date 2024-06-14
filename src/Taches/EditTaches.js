import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../Layout';
import { Button, Form, Input, Select, Card, Avatar, Flex, Typography } from "antd";
import { FolderAddOutlined, CalendarOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { status } from '../data/selecteurs';
import { decodeToken } from '../lib/jwt'
import { axiosInstance } from '../lib/axios';
import { useParams, useNavigate } from 'react-router-dom';
const UpdateTask = ({ setOpen }) => {
  const { id } = useParams();
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const navigate = useNavigate();

  const decoded = decodeToken(localStorage.getItem("token"))
  const { data: taskData, isLoading: taskLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tasks/${id}`);
      form.setFieldsValue(response.data);
      return response.data
    },
  })

  const { data: projets, isLoading: projetsLoading } = useQuery({
    queryKey: ['projets'],
    queryFn: async () => {
      const response = await axiosInstance.get('/projets');
      return response.data.projets
    },
  })

  const { data: developpeurs, isLoading: developpeursLoading } = useQuery({
    queryKey: ['developpeurs'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users');
      return response.data.filter(d => d.role === 1).flatMap((d) => ({
        label: <Flex align="center" gap={4}><Avatar src={d.image} style={{ width: "50px", height: "50px" }} /><Typography.Title level={5}>{d.name}</Typography.Title></Flex>,
        value: d._id
      }));
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data }) => {
      const updateData = { ...data };
      await axiosInstance.patch(`/tasks/${id}`, updateData)
      navigate('/Taches');
    },
  })

  return (
    <Layout>
      <Card title={<><FolderAddOutlined /> Modifier une tâche</>} className="mb-4">
        <Form layout='vertical' form={form} onFinish={(values) => mutate({ data: values })} className="custom-form">
          {/* Projet */}
          {(decoded.role === 1 || decoded.role === 2) && (
            <Form.Item
              label="Projet"
              name={['projet', '_id']}
              rules={[
                {
                  required: true,
                  message: 'Veuillez sélectionner un projet',
                },
              ]}
            >
              <Select
                loading={projetsLoading}
                options={projets?.map(p => ({ label: p.nom, value: p._id }))}
                disabled={decoded.role !== 1} // Désactiver le champ si le rôle n'est pas 1
              />
            </Form.Item>
          )}

          {/* État */}
          {(decoded.role === 1 || decoded.role === 2) && (
            <Form.Item
              label="État"
              name="etat"
              rules={[
                {
                  required: true,
                  message: 'Veuillez saisir un état',
                },
              ]}
            >
              <Select options={status} />
            </Form.Item>
          )}

          {/* Nom */}
          {(decoded.role === 2) && (
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
              <Input suffix={<i className="fas fa-align-left" />} />
            </Form.Item>
          )}
          <Input
            suffix={<CalendarOutlined />}
            value={form.getFieldValue('dateDebut') ? new Date(form.getFieldValue('dateDebut')).toISOString().split('T')[0] : ''}
          />
          <Input
            suffix={<CalendarOutlined />}
            value={form.getFieldValue('dateFin') ? new Date(form.getFieldValue('dateFin')).toISOString().split('T')[0] : ''}
          />
          {/* Description */}
          {(decoded.role === 2) && (
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
              <Input.TextArea suffix={<i className="fas fa-align-left" />} />
            </Form.Item>
          )}

          {/* Développeur */}
          {(decoded.role === 2) && (
            <Form.Item
              label="Développeur"
              name="developpeur"
              rules={[
                {
                  required: true,
                  message: 'Veuillez sélectionner un développeur',
                },
              ]}
            >
              <Select
                options={developpeurs}
                allowClear
                loading={developpeursLoading}
              />
            </Form.Item>
          )}

          <Button htmlType='submit' type='primary' icon={<FolderAddOutlined />}>Modifier la tâche</Button>
        </Form>
      </Card>
    </Layout >
  );
};

export default UpdateTask;
