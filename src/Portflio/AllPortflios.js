import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import { Card, Collapse, List, Spin, Alert, Typography, Row, Col } from 'antd';
import { FolderOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Layout from '../Layout';

const { Meta } = Card;
const { Panel } = Collapse;
const { Title, Text } = Typography;

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
        console.error('Erreur lors de la récupération des projets :', error);
        setError('Une erreur s\'est produite lors de la récupération des projets.');
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
        style={{ borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        actions={[
          <FolderOutlined key="folder" onClick={() => handleClientClick(project._id)} />,
        ]}
      >
        <Meta
          title={project.nom}
          description={
            <>
              <Text strong>Coût:</Text> {project.coutProjet}<br />
              <Text strong>Date Début:</Text> {dayjs(project.dateDebut).format('YYYY-MM-DD')}<br />
              <Text strong>Date Fin:</Text> {dayjs(project.dateFin).format('YYYY-MM-DD')}
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
          <Row align="middle">
            <Col span={20}>
              <Title level={4} style={{ margin: 0 }}>
                {clientsProjects[clientId][0].clientId.nom} {clientsProjects[clientId][0].clientId.prenom}
              </Title>
              <Text>({clientsProjects[clientId].length} projets)</Text>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <UserOutlined style={{ fontSize: 24 }} />
            </Col>
          </Row>
        }
        key={clientId}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>

          <Col span={8}>
            <Text strong>Numéro:</Text> <PhoneOutlined /> {clientsProjects[clientId][0].clientId.numero}
          </Col>
        </Row>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={clientsProjects[clientId]}
          renderItem={renderProjectCard}
          style={{ marginTop: 16 }}
        />
      </Panel>
    ));
  };

  return (
    <Layout>
      <Card className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary"> &#128194; Tous les Portfolios</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">


            <Collapse accordion>
              {loading ? (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Spin size="large" />
                </div>
              ) : error ? (
                <Alert message={`Erreur: ${error}`} type="error" />
              ) : (
                renderClientProjects()
              )}
            </Collapse>        </div>
        </div>
      </Card>

    </Layout>
  );
};

export default AllPortfolios;
