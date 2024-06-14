import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../Layout';
import { Select } from 'antd';
import { EnvironmentOutlined, SaveOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const ModifyClient = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [clientData, setClientData] = useState({
    nom: '',
    prenom: '',
    numero: '',
    etat: '',
    notes: '',
    nomentreprise: '',
    pays: '',
    Matriculefiscale: '',
    adresse: '',
  });
  const [updated, setUpdated] = useState(false);
  const [paysList, setPaysList] = useState([]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/client/${clientId}`);
        setClientData(response.data.client);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du client:', error);
      }
    };
    fetchClientData();
  }, [clientId]);

  useEffect(() => {
    const fetchPaysList = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        setPaysList(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des pays:', error);
      }
    };
    fetchPaysList();
  }, []);

  const handleUpdateClient = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/api/clients/${clientId}`, clientData);
      setUpdated(true);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
    }
  };

  useEffect(() => {
    if (updated) {
      navigate('/AllClient', { replace: true }); // Utilisation de { replace: true } pour remplacer l'historique de navigation
    }
  }, [updated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  return (
    <Layout>
      <div>
        <h2>Modifier Client</h2>
        <form onSubmit={handleUpdateClient}>
          <label htmlFor="nom">Nom:</label>
          <input type="text" id="nom" name="nom" value={clientData.nom} onChange={handleChange} />
          <label htmlFor="nom">prenom:</label>
          <input type="text" id="prenom" name="prenom" value={clientData.prenom} onChange={handleChange} />
          <label htmlFor="numero">Numéro:</label>
          <input type="text" id="numero" name="numero" value={clientData.numero} onChange={handleChange} />

          <label htmlFor="etat">État:</label>
          <input type="text" id="etat" name="etat" value={clientData.etat} onChange={handleChange} />

          <label htmlFor="notes">Notes:</label>
          <input type="text" id="notes" name="notes" value={clientData.notes} onChange={handleChange} />

          <label htmlFor="nomentreprise">Entreprise:</label>
          <input type="text" id="nomentreprise" name="nomentreprise" value={clientData.nomentreprise} onChange={handleChange} />

          <label htmlFor="pays">Pays:</label>
          <Select
            name="pays"
            value={clientData.pays}
            onChange={(value) => setClientData({ ...clientData, pays: value })}
            suffixIcon={<EnvironmentOutlined />}
          >
            {paysList.map((pays) => (
              <Option key={pays.name.common} value={pays.name.common}>
                <img src={pays.flags.png} alt={pays.name.common} style={{ width: 20, marginRight: 10 }} />
                {pays.name.common}
              </Option>
            ))}
          </Select>

          <label htmlFor="Matriculefiscale">Matriculefiscale:</label>
          <input type="text" id="Matriculefiscale" name="Matriculefiscale" value={clientData.Matriculefiscale} onChange={handleChange} />

          <label htmlFor="adresse">Adresse:</label>
          <input type="text" id="adresse" name="adresse" value={clientData.adresse} onChange={handleChange} />

          <button type="submit"><SaveOutlined /> Mettre à jour</button>
        </form>
      </div>
    </Layout>
  );
};

export default ModifyClient;
