import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Tag, Card } from 'antd';
import { useParams } from 'react-router-dom';
import Layout from '../Layout';
import dayjs from 'dayjs';

const ViewPortfolio = () => {
  const { clientId } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/projects/${clientId}`);
        setProjects(response.data.projects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('An error occurred while fetching projects.');
        setLoading(false);
      }
    };
    fetchProjects();
  }, [clientId]);

  const columns = [
    {
      title: <span style={{ fontWeight: 'bold' }}>Name</span>,
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: <span style={{ fontWeight: 'bold' }}>Description</span>,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: <span style={{ fontWeight: 'bold' }}>Date Debut</span>,
      dataIndex: 'dateDebut',
      key: 'dateDebut',
      render: (_, record) => (
        <span>{dayjs(record.dateDebut).format('YYYY-MM-DD')}</span>
      ),
    },
    {
      title: <span style={{ fontWeight: 'bold' }}>Date Fin</span>,
      dataIndex: 'dateFin',
      key: 'dateFin',
      render: (_, record) => (
        <span>{dayjs(record.dateFin).format('YYYY-MM-DD')}</span>
      ),
    },
    {
      title: <span style={{ fontWeight: 'bold' }}>Coût Projet</span>,
      dataIndex: 'coutProjet',
      key: 'coutProjet',
    },
    {
      title: <span style={{ fontWeight: 'bold' }}>Status</span>,
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span>
          {record.status === 0 ? <Tag color="green">Active</Tag> : <Tag color="red">Non Active</Tag>}
        </span>
      ),
    },
  ];
  const getRowClassName = (record) => {
    return record.status === 0 ? 'green-row' : 'red-row';
  };

  const calculateProjectTotals = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter((project) => project.status === 0).length;
    const inactiveProjects = projects.filter((project) => project.status !== 0).length;
    return { totalProjects, activeProjects, inactiveProjects };
  };

  const { totalProjects, activeProjects, inactiveProjects } = calculateProjectTotals();

  return (
    <Layout>
      <Card className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary"> &#128194; les projets de chaque client</h6>
        </div>
        <div className="card-header py-3">
          <div className="project-totals" style={{ display: 'flex', fontWeight: 'bold' }}>
            <div style={{ marginRight: '20px' }}>Total Projects: {totalProjects}</div>
            <div style={{ marginRight: '20px' }}>Active Projects: <Tag color="green">{activeProjects}</Tag></div>
            <div>Inactive Projects: <Tag color="red">{inactiveProjects}</Tag></div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <Table
              dataSource={projects}
              columns={columns}
              bordered
              loading={loading}
              rowClassName={getRowClassName}
            />
          </div>
        </div>
      </Card>
    </Layout >
  );
};

export default ViewPortfolio;
