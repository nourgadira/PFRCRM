import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, message, Select, Card } from 'antd';
import { axiosInstance } from '../lib/axios';
import moment from 'moment';
import Layout from '../Layout';

const { TextArea } = Input;
const { Option } = Select;

const ModifierRendezvous = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRendezvous = async () => {
      try {
        const response = await axiosInstance.get(`/rendezvous/${id}`);
        const rdv = response.data;
        form.setFieldsValue({
          ...rdv,
          dateHeure: moment(rdv.dateHeure),
        });
      } catch (error) {
        message.error('Erreur lors de la récupération des détails du rendez-vous');
      }
    };

    fetchRendezvous();
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axiosInstance.patch(`/rendezvous/${id}`, {
        ...values,
        dateHeure: values.dateHeure.toISOString(),
      });
      message.success('Rendez-vous mis à jour avec succès');
      navigate('/Rendezvous');
    } catch (error) {
      message.error('Erreur lors de la mise à jour du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <Card title="Modifier Rendez-vous">
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
              name="dateHeure"
              label="Date et Heure"
              rules={[{ required: true, message: 'Veuillez entrer la date et l\'heure du rendez-vous' }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Veuillez entrer le type de rendez-vous' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="langue"
              label="Langue"
              rules={[{ required: true, message: 'Veuillez entrer la langue du rendez-vous' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="notes" label="Notes">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="nomclient"
              label="Nom du Client"
              rules={[{ required: true, message: 'Veuillez entrer le nom du client' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="prenomclient"
              label="Prénom du Client"
              rules={[{ required: true, message: 'Veuillez entrer le prénom du client' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="lieu" label="Lieu">
              <Input />
            </Form.Item>
            <Form.Item name="etat" label="État">
              <Input />
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Mettre à jour
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default ModifierRendezvous;
