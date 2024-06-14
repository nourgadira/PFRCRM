import React from 'react';
import { ProjectOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const GlobalStats = ({ projets, clients, users }) => {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    return (
        <Row gutter={16}>
            {users && (
                <Col span={8}>
                    <Link to={"/users"} style={{ textDecoration: "none" }}>
                        <Card bordered={false} hoverable>
                            <Statistic
                                title="Utilisateurs"
                                value={users.length}
                                valueStyle={{
                                    color: '#EFA00B',
                                    fontWeight: "bold"
                                }}
                                prefix={<UserOutlined />}
                                suffix="Utilisateurs"
                            />
                        </Card>
                    </Link>
                </Col>
            )}
            {clients && (
                <Col span={8}>
                    <Link to={"/clients"} style={{ textDecoration: "none" }}>
                        <Card bordered={false} hoverable>
                            <Statistic
                                title="Clients"
                                value={clients.length}
                                valueStyle={{
                                    color: '#D65108',
                                    fontWeight: "bold"
                                }}
                                prefix={<UserOutlined />}
                                suffix="Clients"
                            />
                        </Card>
                    </Link>
                </Col>
            )}
            {projets && (
                <Col span={8}>
                    <Link to={"/projets"} style={{ textDecoration: "none" }}>
                        <Card bordered={false} hoverable>
                            <Statistic
                                title="Projets"
                                value={projets.length}
                                valueStyle={{
                                    color: '#1aaa6e',
                                    fontWeight: "bold"
                                }}
                                prefix={<ProjectOutlined />}
                                suffix="Projets"
                            />
                        </Card>
                    </Link>
                </Col>
            )}
        </Row>
    );
};

export default GlobalStats;
