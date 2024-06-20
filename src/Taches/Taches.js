import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Modal, Table, Tag, Input, Typography, Form, Space, Flex, Card } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import dayjs from "dayjs";
import { decodeToken } from "../lib/jwt";
import CreateTask from "./CreateTaches";
import { getPermissions } from "../helpers/helpers";
import { SearchOutlined, StopOutlined } from '@ant-design/icons';
import Layout from "../Layout";

const GetAllT = () => {
  const [openSendProblem, setOpenSendProblem] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [form] = Form.useForm();
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const decoded = decodeToken(localStorage.getItem("token"));

  const fetchTasks = async () => {
    const pathParts = window.location.pathname.split("/");
    const projectId = pathParts.length >= 3 ? pathParts[2] : null;
    const response = await axiosInstance.get("/tasks");

    let tasks = response.data;
    if (decoded?.role === 1) {
      tasks = tasks.filter(task => task.developpeur && task.developpeur._id === decoded?.id);
    } else if (projectId) {
      tasks = tasks.filter(task => task.projet && task.projet._id === projectId);
    }
    setTasks(tasks);
    setFilteredTasks(tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.nom.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchText, tasks]);

  const getStatusColor = (task) => {
    if (task.etat === "done") {
      return "lightgreen";
    } else if (task.etat === "INPROGRESS") {
      return "lightyellow";
    } else if (dayjs(task.dateFin).isBefore(dayjs())) {
      return "lightcoral";
    }
    return "";
  };

  const ModalCreateTask = () => (
    <Modal
      visible={openCreateTask}
      title="Créer une tâche"
      onCancel={() => setOpenCreateTask(false)}
      footer={null}
    >
      <CreateTask setOpen={setOpenCreateTask} />
    </Modal>
  );

  const ModalDescription = ({ description, visible, onClose }) => (
    <Modal
      visible={visible}
      title="Description"
      onCancel={onClose}
      footer={null}
    >
      <Typography.Paragraph>{description}</Typography.Paragraph>
    </Modal>
  );

  const { data: messages } = useQuery({
    queryKey: ["notes", taskId],
    queryFn: async () => {
      if (taskId) {
        const response = await axiosInstance.get(`/notes?taskId=${taskId}`);
        return response.data;
      }
      return [];
    },
  });

  const ModalSendProblem = ({ visible, onClose }) => {
    const { mutate, isPending } = useMutation({
      mutationFn: async (values) => {
        const response = await axiosInstance.post('/notes', values);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes", taskId] });
        form.resetFields();
      },
    });

    return (
      <Modal
        visible={visible}
        title="Envoyer un problème"
        onCancel={onClose}
        footer={false}
      >
        <div style={{ padding: 10, overflow: 'auto', width: "100%" }}>
          {messages?.map(message => (
            <div key={message._id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {decoded.id !== message?.sender._id && <Avatar size="large" src={message?.sender?.image} />}
                <div style={{ background: "#edede9", padding: 10, borderRadius: 10, marginLeft: 10 }}>
                  <Typography.Text>{message.content}</Typography.Text>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Form form={form} onFinish={(values) => mutate({ ...values, taskId })}>
          <Form.Item name="content" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Décrivez le problème ici..." />
          </Form.Item>
          <Space style={{ marginTop: 10 }}>
            <Button htmlType="submit" loading={isPending} disabled={isPending}>Envoyer</Button>
          </Space>
        </Form>
      </Modal>
    );
  };

  const columns = [
    {
      title: 'Projet',
      dataIndex: 'projet',
      key: 'projet',
      render: (_, record) => {
        if (record.projet) {
          return <Link to={`/taches/${record.projet._id}`} style={{ textDecoration: "none" }}><Typography.Title level={5}>{record.projet.nom}</Typography.Title></Link>;
        }
      }
    },
    {
      title: 'Développeur',
      dataIndex: 'developpeur',
      key: 'developpeur',
      render: (developer) => (
        <Flex align="center" gap={6}>
          <Avatar src={developer?.image} />
          <span>{developer?.name}</span>
        </Flex>
      ),
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Etat',
      dataIndex: 'etat',
      key: 'etat',
      sorter: (a, b) => a.etat.localeCompare(b.etat),
      render: (etat) => {
        let color;
        switch (etat) {
          case "TODO": color = "green"; break;
          case "INPROGRESS": color = "blue"; break;
          case "done": color = "volcano"; break;
          default: color = "default";
        }
        return <Tag color={color}>{etat}</Tag>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <Button type="link" onClick={() => setSelectedDescription(description)}>
          Voir la description
        </Button>
      ),
    },
    {
      title: 'Date Début',
      dataIndex: 'dateDebut',
      key: 'dateDebut',
      render: (_, record) => <span>{dayjs(record.dateDebut).format('YYYY-MM-DD')}</span>,
    },
    {
      title: 'Date Fin',
      dataIndex: 'dateFin',
      key: 'dateFin',
      render: (_, record) => <span>{dayjs(record.dateFin).format('YYYY-MM-DD')}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Button danger onClick={() => {
            form.setFieldValue('taskId', record._id);
            setTaskId(record._id);
            setOpenSendProblem(true);
          }} icon={<StopOutlined />}>{record.countMessages}</Button>
          <Button onClick={() => navigate(`/EditTaches/${record._id}`)}>Modifier</Button>
        </div>
      ),
    },
  ];

  const canAccess = () => {
    return getPermissions('Taches', 'create', decoded?.role);
  };

  return (
    <Layout>
      <Card className="shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">LES TACHES</h6>
        </div>
        {canAccess() && (
          <>
            <Button type="primary" onClick={() => setOpenCreateTask(true)}>
              Créer Tâche
            </Button>
            <ModalCreateTask />
          </>
        )}
        <Input
          placeholder="Rechercher"
          style={{ width: '200px', marginBottom: 16 }}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined style={{ color: 'blue' }} />}
        />
        <div className="card-body">
          <Table
            columns={columns}
            dataSource={filteredTasks.map(task => ({ ...task, key: task._id }))}
            rowClassName={(record) => getStatusColor(record)}
            pagination={false}
            className="table-responsive"
          />
        </div>
      </Card>
      <ModalDescription
        visible={!!selectedDescription}
        description={selectedDescription}
        onClose={() => setSelectedDescription('')}
      />
      <ModalSendProblem
        visible={openSendProblem}
        onClose={() => setOpenSendProblem(false)}
      />
    </Layout>
  );
};
export default GetAllT;