import { CheckCircleOutlined, EnvironmentOutlined, MessageOutlined, PhoneOutlined, SaveOutlined, IdcardOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Select } from "antd";
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { axiosInstance } from '../lib/axios';
import axios from 'axios';

import React, { useState, useEffect } from 'react';
const { Option } = Select;
const AjoutC = () => {
  const [clientData, setClientData] = useState({
    nom: '',
    prenom: '',
    prenom: '',
    numero: '',
    etat: '',
    notes: '',
    nomentreprise: '',
    pays: '',
    Matriculefiscale: '',
    adresse: '',
  });

  const navigate = useNavigate();
  const [paysList, setPaysList] = useState([]);
  const { Option } = Select;

  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.post('/clients', values);
      alert('Client ajouté avec succès');
      navigate('/Clients');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client :', error);
    }
  };


  useEffect(() => {
    const fetchPaysList = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setPaysList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des pays :', error);
      }
    };

    fetchPaysList();
  }, []); // Le tableau vide [] signifie que cette fonction est exécutée une seule fois lors du chargement initial du composant

  const handleSelectChange = (value) => {
    // Ajoutez votre logique de gestion du changement de sélection ici
    console.log('Pays sélectionné :', value);
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card title={<><SolutionOutlined /> Créer un client</>} className="mb-4">
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label="Matricule Fiscale  :"
                  name="Matriculefiscale"
                  rules={[
                    { required: true, message: 'Veuillez saisir votre matricule fiscale' },

                  ]}
                >
                  <Input name="Matriculefiscale" suffix={<IdcardOutlined />} />
                </Form.Item>

                <Form.Item label="Nom :" name="nom" rules={[{ required: true, message: 'Veuillez saisir un nom' }]}>
                  <Input name="nom" suffix={<UserOutlined />} />
                </Form.Item>
                <Form.Item label="prenom :" name="prenom" rules={[{ required: true, message: 'Veuillez saisir un prenom' }]}>
                  <Input name="prenom" suffix={<UserOutlined />} />
                </Form.Item>
                <Form.Item label="prenom :" name="prenom" rules={[{ required: true, message: 'Veuillez saisir un prenom' }]}>
                  <Input name="prenom" suffix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                  label="Numéro :"
                  name="numero"
                  rules={[{ required: true, message: 'Veuillez saisir un numéro' }]}
                >
                  <Input name="numero" suffix={<PhoneOutlined />} value={clientData.numero} />
                </Form.Item>
                <Form.Item
                  label="État du client :"
                  name="etat"
                  rules={[{ required: true, message: 'Veuillez sélectionner un état pour le client' }]}
                >
                  <Select placeholder="Sélectionner un état">
                    <Option value="actif">Actif</Option>
                    <Option value="inactif">a prspecter </Option>
                    <Option value="suspendu">Suspendu</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Notes :" name="notes" rules={[{ required: true, message: 'Veuillez saisir des notes' }]}>
                  <Input.TextArea name="notes" suffix={<MessageOutlined />} rows={4} />
                </Form.Item>
                <Form.Item label="Nom de l'entreprise :" name="nomentreprise" rules={[{ required: true, message: 'Veuillez saisir un nom d\'entreprise' }]}>
                  <Input name="nomentreprise" suffix={<SolutionOutlined />} />
                </Form.Item>

                <Form.Item label="Pays :" name="pays" rules={[{ required: true, message: 'Veuillez sélectionner un pays' }]}>
                  <Select
                    name="pays"
                    suffixIcon={<EnvironmentOutlined />}
                    onChange={handleSelectChange} // Ajout de la fonction de gestion du changement de sélection
                  >
                    {paysList.map((pays) => (
                      <Option key={pays.name.common} value={pays.name.common}>
                        <img src={pays.flags.png} alt={pays.name.common} style={{ width: 20, marginRight: 10 }} />
                        {pays.name.common}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>


                <Form.Item label="Adresse :" name="adresse" rules={[{ required: true, message: 'Veuillez saisir une adresse' }]}>
                  <Input name="adresse" suffix={<EnvironmentOutlined />} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Ajouter</Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AjoutC;
