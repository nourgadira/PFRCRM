import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { Button, Modal, Form, Input, Select, Card, Avatar, Tag, Flex, message, Rate } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, StarOutlined, DollarOutlined, EditOutlined, CreditCardOutlined, LockOutlined, DeleteFilled } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { $ROLES } from '../data/globals';
import { decodeToken } from '../lib/jwt';

const { Option } = Select;
const iconMap = {
  name: <UserOutlined />,
  email: <MailOutlined />,
  password: <LockOutlined />,
  salairefixe: <DollarOutlined />,
  prime: <CreditCardOutlined />,
  cin: <CreditCardOutlined />
};

const Users = () => {
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const decoded = decodeToken(localStorage.getItem('token'));
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');

  const handleSearchName = (value) => {
    setSearchName(value.toLowerCase());
  };

  const handleSearchRole = (value) => {
    setSearchRole(value);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const getTotalUsers = (users) => {
    return users.length;
  };

  const filteredUsers = users.filter(user => {
    const byName = user.name.toLowerCase().includes(searchName);
    const byRole = searchRole ? user.role === parseInt(searchRole, 10) : true;
    return byName && byRole;
  });

  const totalUsers = getTotalUsers(filteredUsers);

  const { isLoading } = useQuery({
    queryKey: ['users_all'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    },
  });

  const onCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const onCloseDetailsModal = () => {
    setOpenDetailsModal(false);
  };

  const EditUser = (id, values) => {
    axiosInstance.patch('/users/' + id, { ...values }).then(res => {
      message.success("Utilisateur mis à jour avec succès");
      onCloseEditModal();
      // Mettre à jour la liste des utilisateurs après la mise à jour réussie
      const updatedUsers = users.map(user => {
        if (user._id === id) {
          return { ...user, ...values };
        }
        return user;
      });
      setUsers(updatedUsers);
    }).catch(() => {
      message.error("Problème lors de la mise à jour de l'utilisateur");
    });
  };

  const handleUpdateRating = (id, newRating) => {
    axiosInstance.patch(`/users/${id}`, { rating: newRating }).then(res => {
      message.success("Note mise à jour avec succès");

      // Mettre à jour la liste des utilisateurs après la mise à jour réussie
      const updatedUsers = users.map(user => {
        if (user._id === id) {
          return { ...user, rating: newRating };
        }
        return user;
      });
      setUsers(updatedUsers); // Mettre à jour l'état avec les nouvelles données

    }).catch(() => {
      message.error("Problème lors de la mise à jour de la note");
    });
  };

  const archiveUser = (id, value, action) => {
    if (window.confirm(`Vous êtes sûr de ${action.toLowerCase()} cet utilisateur ?`)) {
      axiosInstance.patch(`/users/${id}?status=archive`, { active: value }).then(res => {
        message.success("Utilisateur mis à jour avec succès");
        onCloseDetailsModal();
        // Mettre à jour la liste des utilisateurs après la mise à jour réussie, sauf si c'est une restauration
        const updatedUsers = users.map(user => {
          if (user._id === id) {
            return { ...user, active: value };
          }
          return user;
        });
        setUsers(updatedUsers);
        if (value) {
          queryClient.invalidateQueries("users_all"); // Rafraîchir la liste des utilisateurs après un "Restore" réussi
        }
      }).catch(() => {
        message.error("Problème lors de la mise à jour de l'utilisateur");
      });
    }
  };



  const DeleteUser = (id) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet utilisateur ?`)) {
      axiosInstance.delete(`/users/${id}`).then(res => {
        message.success("Utilisateur supprimé avec succès");
        onCloseDetailsModal();
        // Mettre à jour la liste des utilisateurs après la suppression réussie
        const updatedUsers = users.filter(user => user._id !== id);
        setUsers(updatedUsers);
      }).catch(() => {
        message.error("Problème lors de la suppression de l'utilisateur");
      });
    }
  };


  const handleShowDetails = (employee) => {
    setSelectedUser(employee);
    setOpenDetailsModal(true);
  };

  const onEdit = (id) => {
    form.resetFields();
    setOpenEditModal(true);
    const userToEdit = users.find(user => user._id === id);
    form.setFieldsValue(userToEdit);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mt-4">
        <div className="row align-items-center mb-4 g-3">
          <div className="col-md-4">
            <Input.Search
              placeholder="Rechercher par nom"
              allowClear
              onChange={(e) => handleSearchName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div className="col-md-4">
            <Select
              placeholder="Filtrer par rôle"
              allowClear
              onChange={(value) => handleSearchRole(value)}
              style={{ width: '100%' }}
            >
              {$ROLES.map(role => (
                <Option key={role.key} value={role.key}>{role.name}</Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0 text-gray-800" style={{ display: 'flex', alignItems: 'center', color: '#4e73df', fontWeight: 'bold' }}>
                <span style={{ borderBottom: '2px solid #4e73df', paddingBottom: '4px' }}>UTILISATEURS</span>
                <span style={{ marginLeft: '10px', backgroundColor: '#f8f9fc', padding: '5px 10px', borderRadius: '5px', color: '#4e73df' }}>{totalUsers}</span>
              </h1>              <Link to="/Create" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                <i className="fas fa-plus fa-sm text-white-50 m-2"></i>Créer un utilisateur
              </Link>
            </div>

            <div className="row justify-content-center">
              {filteredUsers.map((employee) => (
                <Card
                  key={employee._id}
                  className="col-md-5 col-sm-6 m-3"
                  style={{
                    borderLeft: '4px solid #1890ff',
                    borderRight: '4px solid #1890ff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                  }}
                >
                  <Flex justify="space-between">
                    {employee.active === "true" ? <Tag color="green">Active</Tag> : <Tag color="red">Archived</Tag>}
                    {employee.active === "false" && <Button icon={<DeleteFilled />} onClick={() => DeleteUser(employee._id)}></Button>}
                  </Flex>

                  <div style={{ marginTop: 10 }}>
                    <Rate value={employee.rating} onChange={(value) => handleUpdateRating(employee._id, value)} />
                  </div>



                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                    <Avatar src={employee?.image} style={{ width: 100, height: 100, marginBottom: '10px' }} />
                    <span style={{ fontWeight: '700', marginBottom: '5px' }}>{`${employee.prenom || ''} ${employee.name || ''}`}</span>
                    <span style={{ color: '#1890ff', marginBottom: '10px' }}>{employee.role ? $ROLES.find(role => role.key === employee.role)?.name || '' : ''}</span>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(employee._id)}>
                        Modifier
                      </Button>
                      <Button onClick={() => handleShowDetails(employee)}>Afficher Détails</Button>
                      {decoded.id !== employee._id && (
                        employee.active === "true" ? <Button danger onClick={() => archiveUser(employee._id, false, "Archiver")}>Archiver</Button> : <Button danger onClick={() => archiveUser(employee._id, true, "Restaurer")}>Restaurer</Button>
                      )}
                    </div>
                  </div>

                </Card>

              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Modifier Utilisateur"
        visible={openEditModal}
        onCancel={onCloseEditModal}
        onOk={() => form.submit()}
        okText="Modifier utilisateur"
      >
        <Form layout="vertical" form={form} onFinish={(values) => EditUser(form.getFieldValue('_id'), values)}>
          <Form.Item label="Nom" name="name" rules={[{ required: true, message: 'Veuillez saisir un nom' }]}>
            <Input name="name" prefix={<UserOutlined />} disabled />
          </Form.Item>
          <Form.Item label="Prénom" name="prenom" rules={[{ required: true, message: 'Veuillez saisir un prénom' }]}>
            <Input name="prenom" prefix={<UserOutlined />} disabled />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Veuillez saisir un email' }]}>
            <Input name="email" prefix={<MailOutlined />} disabled />
          </Form.Item>
          <Form.Item label="Téléphone" name="telephone" rules={[{ required: true, message: 'Veuillez saisir un téléphone' }]}>
            <Input name="telephone" prefix={<PhoneOutlined />} />
          </Form.Item>
          <Form.Item label="CIN" name="cin" rules={[{ required: true, message: 'Veuillez saisir un cin' }]}>
            <Input name="cin" prefix={<IdcardOutlined />} disabled />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Veuillez sélectionner un rôle' }]}>
            <Select name="role">
              <Option value={1}>Développeur</Option>
              <Option value={2}>Chef Projet</Option>
              <Option value={3}>Directeur Commercial</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Salaire Fixe" name="salairefixe" rules={[{ required: true, message: 'Veuillez saisir un salaire fixe' }]}>
            <Input name="salairefixe" prefix={<DollarOutlined />} />
          </Form.Item>
          <Form.Item label="Prime" name="prime" rules={[{ required: true, message: 'Veuillez saisir une prime' }]}>
            <Input name="prime" prefix={<CreditCardOutlined />} />
          </Form.Item>

        </Form>
      </Modal>

      <Modal
        title="Détails Utilisateur"
        visible={openDetailsModal}
        onCancel={onCloseDetailsModal}
        footer={[
          <Button key="close" onClick={onCloseDetailsModal}>
            Fermer
          </Button>
        ]}
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={selectedUser.image} size={64} />
            <div style={{ marginTop: '10px', textAlign: 'left' }}>
              <p><strong>Nom:</strong> {selectedUser.name}</p>
              <p><strong>Prénom:</strong> {selectedUser.prenom}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Téléphone:</strong> {selectedUser.telephone}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Salaire Fixe:</strong> {selectedUser.salairefixe}</p>
              <p><strong>Prime:</strong> {selectedUser.prime}</p>
              <p><strong>CIN:</strong> {selectedUser.CIN}</p>
              <p><strong>Téléphone:</strong> {selectedUser.telephone}</p>
            </div>
          </div>
        )}
      </Modal>

    </Layout>
  );
};

export default Users;