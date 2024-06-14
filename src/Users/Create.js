import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Select, Button, Upload, Modal, Row, Col, Typography, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, DollarOutlined, CreditCardOutlined, FolderAddOutlined, SaveOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../Layout';
import { axiosInstance } from "../lib/axios";

const { Option } = Select;
const { Title } = Typography;

const Create = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState('');

  const validateCIN = (rule, value) => {
    if (!value || /^\d{8}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject('Le CIN doit contenir exactement 8 chiffres');
  };
  const validateTelephone = (rule, value) => {
    if (!value || /^\+216\d{8}$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject('Le numéro de téléphone doit commencer par "+216" et contenir exactement 8 chiffres');
  };


  const submitForm = async (values) => {
    try {
      const userData = {
        ...values,
        active: "true",
      };

      const response = await axiosInstance.post("/Users", userData);
      console.log(response.data);
      alert("Utilisateur ajouté avec succès");
      navigate("/Users");
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        console.log("Response data:", error.response.data);
        setErrorMessage(error.response.data.message || "Une erreur est survenue lors de la création de l'utilisateur.");
      } else if (error.request) {
        console.log("No response received:", error.request);
        setErrorMessage("Aucune réponse reçue du serveur.");
      } else {
        console.log("Error setting up request:", error.message);
        setErrorMessage("Erreur de configuration de la requête : " + error.message);
      }
    }
  };

  const iconMap = {
    name: <UserOutlined />,
    prenom: <UserOutlined />,
    email: <MailOutlined />,
    password: <LockOutlined />,
    salairefixe: <DollarOutlined />,
    prime: <CreditCardOutlined />,
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card title={<><FolderAddOutlined /> Ajout Utilisateur</>} className="mb-4">
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              <Form layout="vertical" form={form} onFinish={submitForm}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Nom"
                      name="name"
                      rules={[{ required: true, message: 'Veuillez saisir un nom' }]}
                    >
                      <Input name="name" suffix={iconMap['name']} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Prénom"
                      name="prenom"
                      rules={[{ required: true, message: 'Veuillez saisir un prénom' }]}
                    >
                      <Input name="prenom" suffix={iconMap['prenom']} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="CIN"
                      name="cin"
                      rules={[
                        { required: true, message: 'Veuillez saisir un CIN' },
                        { validator: validateCIN }
                      ]}
                    >
                      <Input name="cin" suffix={iconMap['cin']} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Téléphone"
                      name="telephone"
                      rules={[
                        { required: true, message: 'Veuillez saisir un numéro de téléphone' },
                        { validator: validateTelephone }
                      ]}
                    >
                      <Input addonBefore={iconMap['telephone']} placeholder="+216XXXXXXXX" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Veuillez saisir un email' }]}
                >
                  <Input name="email" suffix={iconMap['email']} />
                </Form.Item>
                <Form.Item
                  label="Mot de passe"
                  name="password"
                  rules={[{ required: true, message: 'Veuillez saisir un mot de passe' }]}
                >
                  <Input.Password name="password" suffix={iconMap['password']} />
                </Form.Item>
                <Form.Item
                  label="Rôle"
                  name="role"
                  rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}
                >
                  <Select name="role">
                    <Option value={1}>Développeur</Option>
                    <Option value={2}>Chef Projet</Option>
                    <Option value={3}>Directeur Commercial</Option>
                  </Select>
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Salaire Fixe"
                      name="salairefixe"
                      rules={[{ required: true, message: 'Veuillez saisir un salaire fixe' }]}
                    >
                      <Input name="salairefixe" suffix={iconMap['salairefixe']} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Prime"
                      name="prime"
                      rules={[{ required: true, message: 'Veuillez saisir une prime' }]}
                    >
                      <Input name="prime" suffix={iconMap['prime']} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Enregistrer
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
