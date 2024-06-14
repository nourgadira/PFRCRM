import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Progress, Row, Col, Card, Spin, Flex, Typography, Statistic } from 'antd';
import Layout from './Layout';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios';
import GlobalStats from './stats/Stats';
import { PieChart } from './stats/PieChart';
import Calendrier from './calendrier/Calendrier';
import { jwtDecode } from 'jwt-decode';
import { ProjectOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const decoded = jwtDecode(localStorage.getItem('token'));

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return axiosInstance.get('/users').then(res => res.data);
    }
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      return axiosInstance.get('/clients').then(res => res.data);
    }
  });

  const { data: projets, isLoading: isLoadingProjets } = useQuery({
    queryKey: ['projets'],
    queryFn: async () => {
      return axiosInstance.get('/projets').then(res => res.data.projets);
    }
  });

  const { data: paiements } = useQuery({
    queryKey: ['paiement'],
    queryFn: async () => {
      return axiosInstance.get('/paiement').then(res => res.data);
    }
  });

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      return axiosInstance.get('/tasks').then(res => res.data);
    }
  });

  const { data: rendezvous } = useQuery({
    queryKey: ['rendezvous'],
    queryFn: async () => {
      return axiosInstance.get('/rendezvous').then(res => res.data);
    },
    select: (data) => {
      // Tri des rendez-vous par date
      const sortedRendezvous = data.sort((a, b) => new Date(a.dateHeure) - new Date(b.dateHeure));
      // Filtrer le prochain rendez-vous
      const nextRdv = sortedRendezvous.find(r => new Date(r.dateHeure).getTime() > Date.now());
      return nextRdv;
    },
  });

  const nextRendezVous = rendezvous?.dateHeure;

  // Utilisez Number pour convertir les valeurs en nombres
  const totalAmount = projets?.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.coutProjet || 0);
  }, 0);

  const paiementAmount = paiements?.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.avance || 0);
  }, 0);

  const percent = totalAmount > 0 ? (paiementAmount / totalAmount) * 100 : 0;

  const currentRendezVous = rendezvous?.length > 0 ? new Date(rendezvous[0]?.dateHeure).toLocaleDateString() : "N/A";

  return (
    <Layout>
      <div>
        <h2>Tableau de bord</h2>
        {
          decoded?.role !== 1 && <GlobalStats projets={projets} clients={clients} users={users} />
        }
        {decoded?.role === 1 &&
          <Row>
            <Col span={24}>
              <Link to={"/taches"} style={{ textDecoration: "none" }}>
                <Card bordered={false} hoverable>
                  <Statistic
                    title="Tache"
                    value={tasks?.length}
                    valueStyle={{ color: '#1aaa6e', fontWeight: "bold" }}
                    prefix={<ProjectOutlined />}
                    suffix="Taches"
                  />
                </Card>
              </Link>
            </Col>
          </Row>
        }
        {
          decoded?.role === 0 && <Row>
            {
              isLoadingProjets ?
                <Spin spinning /> :
                <>
                  <Card style={{ marginTop: "12px", width: "100%" }} title="Totale des paiements">
                    <Row gutter={16} align={"middle"}>
                      <Col span={4}>
                        <img src='/salary.png' style={{ width: "100px" }} />
                      </Col>
                      <Col span={20}>
                        <Row gutter={16}>
                          <Col span={8}>
                            <Card bordered hoverable style={{ background: "#C0C2C9", width: "100%" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography.Title level={3}>{totalAmount} $</Typography.Title>
                                <img src='/gross.png' style={{ width: "40px" }} />
                              </div>
                            </Card>
                          </Col>
                          <Col span={8}>
                            <Card bordered hoverable style={{ background: "#C0C2C9" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography.Title level={3}>{paiementAmount} $</Typography.Title>
                                <img src='/gross.png' style={{ width: "40px" }} />
                              </div>
                            </Card>
                          </Col>
                          <Col span={8}>
                            <Card bordered hoverable style={{ background: "#C0C2C9" }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography.Title level={3}>{Math.round(percent)} %</Typography.Title>
                                <img src='/percent.png' style={{ width: "40px" }} />
                              </div>
                            </Card>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </>
            }
          </Row>
        }
        {
          decoded?.role === 3 && <Row>
            <Card style={{ marginTop: "12px", width: "100%" }} title="Prochain rendez-vous">
              <Row gutter={16} align={"middle"}>
                <Col span={4}>
                  <img src='/schedule.png' style={{ width: "100px" }} />
                </Col>
                <Col span={20}>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Card bordered hoverable style={{ background: "#C0C2C9", width: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography.Title level={3}>{nextRendezVous ? new Date(nextRendezVous).toLocaleDateString() : "N/A"}</Typography.Title>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Row>
        }
        <Row gutter={12} style={{ marginTop: "12px" }}>
          <Col span={8}>
            <Card title="Status des taches">
              <PieChart />
            </Card>
          </Col>
          <Col span={16}>
            <Card>
              <Calendrier />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Dashboard;
