import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { Button, Card, Drawer, Form, Input, message, Modal, Avatar } from 'antd';
import { DollarCircleOutlined, ProjectOutlined, CheckCircleOutlined, DeleteOutlined, EditOutlined, CalendarOutlined, EnvironmentOutlined, FileOutlined, FileAddOutlined, IdcardOutlined, MessageOutlined, PhoneOutlined, PlusOutlined, SaveOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPermissions } from '../helpers/helpers';
import { axiosInstance } from '../lib/axios';
import { decodeToken } from '../lib/jwt';
import CreateProjet from '../Projets/CreateProjets';

const AllClient = () => {
    const [open, setOpen] = useState(false);
    const [openProject, setOpenProject] = useState({
        id: null,
        open: false
    });
    const [client, setClients] = useState([]);

    const navigate = useNavigate(); // Utilisez useNavigate pour la navigation

    const [openAbonnement, setOpenAbonnement] = useState({
        id: null,
        open: false
    });
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const decoded = decodeToken(localStorage.getItem('token'));

    const { data: clients, isLoading } = useQuery({
        queryKey: ["clients"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/clients`);
            return response.data;
        }
    });

    const OpenEditModal = (id) => {
        form.resetFields();
        form.setFieldsValue(clients.find((client) => client._id === id));
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
        form.submit();
    };

    const EditClient = (id, values) => {
        axiosInstance.patch('/clients/' + id, { ...values }).then(res => {
            message.success("Client mis à jour avec succès");
            onClose();
            const updatedClients = clients.map(client => {
                if (client._id === id) {
                    return { ...client, ...values };
                }
                return client;
            });
            setClients(updatedClients);
            window.location.reload();
        }).catch(() => {
            message.error("Problème lors de la mise à jour du client");
        });
    };

    const onEdit = (id) => {
        form.resetFields();
        setOpen(true);
        form.setFieldsValue(clients.find(client => client._id === id));
    };

    const DeleteClient = (id) => {
        if (window.confirm(`Are you sure to delete this client`)) {
            axiosInstance.delete('/clients/' + id).then(res => {
                message.success("Client supprimé avec succès");
                queryClient.invalidateQueries('clients');
            }).catch(() => {
                message.error("Problème lors de la suppression du client");
            });
        }
    };

    const canDelete = () => {
        return getPermissions('Clients', 'delete', decoded?.role);
    };

    const canAccess = () => {
        return getPermissions('Clients', 'create', decoded?.role);
    };

    return (
        <Layout>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <div className="card-header py-3">
                                <h6 className="m-0 font-weight-bold text-primary">  LES CLIENTS</h6>
                            </div>
                            {canAccess() && (
                                <Link to="/CreateClient" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                                    <i className="fas fa-plus fa-sm text-white-50 m-2"></i>Créer un client
                                </Link>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {clients && clients.map((client) => (
                                <Card key={client._id} style={{ width: '350px', borderTop: '3px solid #1890ff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar size={40} src="img/undraw_profile.svg" />
                                            <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '700' }}>{client.nom}</span>
                                                <span style={{ color: '#1890ff' }}>{client.etat}</span>
                                            </div>
                                        </div>
                                        {canAccess() && (
                                            <Button type="primary" icon={<EditOutlined />} onClick={() => OpenEditModal(client._id)} />
                                        )}
                                        <Button
                                            type="primary"
                                            icon={<ProjectOutlined />}
                                            onClick={() => setOpenProject({ id: client._id, open: true })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{ fontWeight: '600' }}>prenom:</p>
                                        <p>{client.prenom}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{ fontWeight: '600' }}>Notes:</p>
                                        <p>{client.notes}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{ fontWeight: '600' }}>Nom Entreprise:</p>
                                        <p>{client.nomentreprise}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{ fontWeight: '600' }}>Pays:</p>
                                        <p>{client.pays}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{ fontWeight: '600' }}>Adresse:</p>
                                        <p>{client.adresse}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{ fontWeight: '600' }}>numero:</p>
                                        <p>{client.numero}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Button type="link" href={`/ViewPortfolio/${client._id}`} icon={<i className="fas fa-eye fa-sm text-white-50 m-2"></i>}>
                                            Liste des portfolios
                                        </Button>
                                        {canAccess() && (
                                            <Button type="danger" icon={<DeleteOutlined />} onClick={() => DeleteClient(client._id)} style={{ backgroundColor: 'green', borderColor: 'green', color: '#fff' }}>
                                                Supprimer
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                open={open}
                onCancel={onClose}
                onOk={() => form.submit()}
                okText="Modifier client"
            >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h4 style={{ color: 'blue' }}>
                        <EditOutlined /> Modifier le client
                    </h4>
                </div>
                <Form layout="vertical" form={form} onFinish={(values, e) => {
                    if (e) e.preventDefault();
                    EditClient(form.getFieldValue('_id'), values);
                }}>
                    <Form.Item label="Id" name="_id">
                        <Input disabled prefix={<IdcardOutlined />} />
                    </Form.Item>
                    <Form.Item label="Nom" name="nom" rules={[{ required: true, message: 'Veuillez saisir un nom' }]}>
                        <Input suffix={<FileOutlined />} disabled />
                    </Form.Item>
                    <Form.Item label="prenom" name="prenom" rules={[{ required: true, message: 'Veuillez saisir un prenom' }]}>
                        <Input suffix={<FileOutlined />} disabled />
                    </Form.Item>
                    <Form.Item label="Numéro" name="numero" rules={[{ required: true, message: 'Veuillez saisir un numéro' }]}>
                        <Input suffix={<PhoneOutlined />} />
                    </Form.Item>
                    <Form.Item label="État" name="etat" rules={[{ required: true, message: 'Veuillez saisir un état' }]}>
                        <Input suffix={<CheckCircleOutlined />} />
                    </Form.Item>
                    <Form.Item label="Notes" name="notes" rules={[{ required: true, message: 'Veuillez saisir des notes' }]}>
                        <Input.TextArea suffix={<MessageOutlined />} disabled />
                    </Form.Item>
                    <Form.Item label="Nom de l'entreprise" name="nomentreprise" rules={[{ required: true, message: 'Veuillez saisir un nom d\'entreprise' }]}>
                        <Input suffix={<SolutionOutlined />} disabled />
                    </Form.Item>
                    <Form.Item label="Pays" name="pays" rules={[{ required: true, message: 'Veuillez saisir un pays' }]}>
                        <Input suffix={<EnvironmentOutlined />} disabled />
                    </Form.Item>

                    <Form.Item label="Adresse" name="adresse" rules={[{ required: true, message: 'Veuillez saisir une adresse' }]}>
                        <Input suffix={<EnvironmentOutlined />} disabled />
                    </Form.Item>
                </Form>

            </Modal >

            {/* create projet */}
            < Drawer open={openProject.id && openProject.open} width={600} onClose={() => setOpenProject({ id: null, open: false })}>
                <CreateProjet clientId={openProject.id} />
            </Drawer >

        </Layout >
    );
};
export default AllClient;
