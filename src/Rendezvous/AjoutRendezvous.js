import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, DownloadOutlined, SolutionOutlined, FileTextOutlined, DollarOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../Layout';
import { axiosInstance } from "../lib/axios"; // Assurez-vous que cette importation est correcte
import { Select } from 'antd';
const { Option } = Select;

const CreateRendezvous = () => {
  const navigate = useNavigate();

  const submitForm = async (values) => {
    try {
      const response = await axiosInstance.post("/rendezvous", {
        dateHeure: values.dateRendezvous,
        lieu: values.lieu,
        type: values.type,
        etat: values.etat,
        nomclient: values.nomclient,
        prenomclient: values.prenomclient,
        langue: values.langue,
        notes: values.notes, // Ajout de la note

      });
      console.log(response.data);
      alert("Rendez-vous ajouté avec succès");
      navigate("/rendezvous");
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      if (error.response) {
        console.log("Données de la réponse :", error.response.data);
      } else if (error.request) {
        console.log("Pas de réponse reçue :", error.request);
      } else {
        console.log("Erreur lors de la configuration de la requête :", error.message);
      }
    }
  };

  const iconMap = {
    dateRendezvous: <UserOutlined />,
    lieu: <DownloadOutlined />,
    type: <DollarOutlined />,
    langue: <CreditCardOutlined />,
    etat: <CheckCircleOutlined />,
    nomClient: <UserOutlined />,
    prenomClient: <UserOutlined />,
    note: <FileTextOutlined />, // Icone pour la note

  };

  return (
    <Layout>

      <div style={{ maxWidth: '600px', margin: 'auto', marginTop: '50px' }}>

        <Card title={<><SolutionOutlined /> Créer un rendezvous</>} className="mb-4">
          <Form
            name="ajoutRendezvous"
            onFinish={submitForm}
            layout="vertical"
          >
            <Form.Item
              label="Date et heure du rendez-vous"
              name="dateRendezvous"
              rules={[{ required: true, message: 'Veuillez saisir une date et une heure' }]}
            >
              <Input type="datetime-local" suffix={iconMap['dateRendezvous']} />
            </Form.Item>

            <Form.Item
              label="Lieu du rendez-vous"
              name="lieu"
              rules={[{ required: true, message: 'Veuillez saisir un lieu' }]}
            >
              <Input suffix={iconMap['lieu']} />
            </Form.Item>
            <Form.Item
              label="notes"
              name="notes"
              rules={[{ message: 'Veuillez saisir notes' }]}
            >
              <Input suffix={iconMap['notes']} />
            </Form.Item>

            <Form.Item
              label="Type de rendez-vous"
              name="type"
              rules={[{ required: true, message: 'Veuillez saisir un type' }]}
            >
              <Select placeholder="Sélectionnez un type de rendez-vous">
                <Option value="en_personne">en presence</Option>
                <Option value="en_ligne">En ligne</Option>
              </Select>
            </Form.Item>


            <Form.Item
              label="Langue du rendez-vous"
              name="langue"
              rules={[{ required: true, message: 'Veuillez saisir une langue' }]}
            >
              <Input suffix={iconMap['langue']} />
            </Form.Item>

            <Form.Item
              label="État du client"
              name="etat"
              rules={[{ required: true, message: 'Veuillez saisir un état' }]}
            >
              <Select placeholder="Sélectionnez l'état du client">
                <Option value="nouveau">Nouveau</Option>
                <Option value="prospecter">Prospecter</Option>
              </Select>
            </Form.Item>


            <Form.Item
              label="Nom du client"
              name="nomclient"
              rules={[{ required: true, message: 'Veuillez saisir un nom' }]}
            >
              <Input suffix={iconMap['nomclient']} />
            </Form.Item>

            <Form.Item
              label="Prénom du client"
              name="prenomclient"
              rules={[{ required: true, message: 'Veuillez saisir un prénom' }]}
            >
              <Input suffix={iconMap['prenomclient']} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

    </Layout >
  );
}

export default CreateRendezvous;
