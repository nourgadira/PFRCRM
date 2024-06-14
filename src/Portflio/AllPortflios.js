import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ce import semble inutilisé
import { axiosInstance } from '../lib/axios'; // De même, il semble inutilisé
import { Card, Collapse, List, Spin, Alert } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Layout from '../Layout';

const { Meta } = Card;
const { Panel } = Collapse;

const AllPortfolios = () => {
  const [clientsProjects, setClientsProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/projets');
        const projects = response.data.projets;
        const projectsByClient = projects.reduce((acc, project) => {
          const clientId = project.clientId._id;
          if (!acc[clientId]) {
            acc[clientId] = [];
          }
          acc[clientId].push(project);
          return acc;
        }, {});
        setClientsProjects(projectsByClient);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('An error occurred while fetching projects.');
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleClientClick = (projectId) => {
    // Gérer l'action de clic sur le client
  };

  const renderProjectCard = (project) => (
    <List.Item>
      <Card
        hoverable
        actions={[
          <FolderOutlined key="user" onClick={() => handleClientClick(project._id)} />,
        ]}
      >
        <Meta
          title={project.nom}
          description={
            <>
              <strong>Coût:</strong> {project.coutProjet}<br />
              <strong>Date Début:</strong> {dayjs(project.dateDebut).format('YYYY-MM-DD')}<br />
              <strong>Date Fin:</strong> {dayjs(project.dateFin).format('YYYY-MM-DD')}
            </>
          }
        />
      </Card>
    </List.Item>
  );

  const renderClientProjects = () => {
    return Object.keys(clientsProjects).map(clientId => (
      <Panel
        header={
          <div>
            <span style={{ fontWeight: '700' }}>{clientsProjects[clientId][0].clientId.nom} {clientsProjects[clientId][0].clientId.prenom}</span>
            <span style={{ marginLeft: 8 }}>({clientsProjects[clientId].length} projets)</span>
          </div>
        }
        key={clientId}
      >
        <p><strong>numero:</strong> {clientsProjects[clientId][0].clientId.numero}</p>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={clientsProjects[clientId]}
          renderItem={renderProjectCard}
        />
      </Panel>
    ));
  };

  return (
    <Layout>
      {/* GlobalStats component */}
      <div className="card-header py-3" style={{ background: '#f0f0f0', padding: '16px 24px', marginBottom: 24 }}>
        {/* Title component */}
      </div>

      <Collapse accordion>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={`Error: ${error}`} type="error" />
        ) : (
          renderClientProjects()
        )}
      </Collapse>

      {/* Modal component */}
    </Layout>
  );
};

export default AllPortfolios;
