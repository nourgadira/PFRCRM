import React from 'react';
import { Card, Form, Input, Select, Button, Avatar, Typography, Row, Col, Space, DatePicker } from 'antd';
import { FolderAddOutlined, AlignLeftOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { decodeToken } from '../lib/jwt';
import { axiosInstance } from '../lib/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { status as taskStatus } from '../data/selecteurs';
import dayjs from 'dayjs';

const { TextArea } = Input;

const UpdateTask = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const decoded = decodeToken(localStorage.getItem("token"));

  const { data: taskData, isLoading: taskLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/tasks/${id}`);
      const task = response.data;
      task.dateDebut = task.dateDebut ? dayjs(task.dateDebut) : null;
      task.dateFin = task.dateFin ? dayjs(task.dateFin) : null;
      form.setFieldsValue(task);
      return task;
    }
  });

  const { data: developpeurs, isLoading: developpeursLoading } = useQuery({
    queryKey: ['developpeurs'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users');
      return response.data
        .filter(d => d.role === 1)
        .map(d => ({
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar src={d.image} />
              <Typography.Text>{d.name}</Typography.Text>
            </div>
          ),
          value: d._id,
        }));
    }
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      const updateData = { ...values };
      await axiosInstance.patch(`/tasks/${id}`, updateData);
      return updateData;
    },
    onSuccess: (data) => {
      if (data.projet && data.projet._id) {
        navigate(`/projets/${data.projet._id}/taches`);
      } else {
        console.error('Project ID is undefined:', data);
      }
    }
  });

  const onFinish = (values) => {
    mutation.mutate(values);
  };

  return (
    <Layout>
      <Card
        title={<><FolderAddOutlined /> Modifier une tâche</>}
        className="mb-4"
        bordered={false}
        style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className="custom-form">
          <Row gutter={[16, 16]}>
            {decoded.role === 2 && (
              <>
                <Col span={12}>
                  <Form.Item
                    label="Nom"
                    name="nom"
                    rules={[{ required: true, message: 'Veuillez saisir un nom' }]}
                  >
                    <Input prefix={<AlignLeftOutlined />} placeholder="Nom de la tâche" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Veuillez saisir une description' }]}
                  >
                    <TextArea rows={4} placeholder="Description de la tâche" />
                  </Form.Item>
                </Col>
              </>
            )}
            {decoded.role === 1 && (
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'Veuillez saisir une description' }]}
                >
                  <TextArea rows={4} placeholder="Description de la tâche" />
                </Form.Item>
              </Col>
            )}
            {decoded.role === 2 && (
              <Col span={12}>
                <Form.Item
                  label="État"
                  name="etat"
                  rules={[{ required: true, message: 'Veuillez saisir un état' }]}
                >
                  <Select options={taskStatus} placeholder="Sélectionner un état" />
                </Form.Item>
              </Col>
            )}
            <Col span={12}>
              <Form.Item
                label="Date Début"
                name="dateDebut"
                rules={[{ required: true, message: 'Veuillez saisir une date de début' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  placeholder="Date de début"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date Fin"
                name="dateFin"
                rules={[{ required: true, message: 'Veuillez saisir une date de fin' }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  placeholder="Date de fin"
                />
              </Form.Item>
            </Col>
            {decoded.role === 2 && (
              <Col span={24}>
                <Form.Item
                  label="Développeur"
                  name="developpeur"
                  rules={[{ required: true, message: 'Veuillez sélectionner un développeur' }]}
                >
                  <Select
                    options={developpeurs}
                    allowClear
                    loading={developpeursLoading}
                    placeholder="Sélectionner un développeur"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<FolderAddOutlined />}
                loading={mutation.isLoading}
                size="large"
                style={{ borderRadius: '5px', padding: '0 30px' }}
              >
                Modifier la tâche
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default UpdateTask;
