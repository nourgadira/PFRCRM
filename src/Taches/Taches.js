import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { Avatar, Button, Modal, Table, Tag, Input, Card, Typography, Flex, Form, Space } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import dayjs from "dayjs";
import { decodeToken } from "../lib/jwt";
import CreateTask from "./CreateTaches";
import { getPermissions } from "../helpers/helpers";
import { ExclamationCircleOutlined } from '@ant-design/icons';

import {
  SearchOutlined, StopOutlined
} from '@ant-design/icons';

const GetAllT = () => {
  const [openSendProblem, setOpenSendProblem] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [form] = Form.useForm();
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [tasksWithNotes, setTasksWithNotes] = useState([]);
  const decoded = decodeToken(localStorage.getItem("token"));

  const queryClient = useQueryClient();

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
        const response = await axiosInstance.post('/notes', { ...values });
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
        onCancel={() => {
          onClose();
          setOpenedTasks([...openedTasks, taskId]);
          setNewNotes(newNotes.filter(id => id !== taskId));
        }}
        footer={false}
      >
        <Flex vertical gap={4} style={{ padding: 10, overflow: 'auto', width: "100%" }}>
          {messages?.map(message => (
            <Flex key={message._id} gap={4} style={{ width: "100%" }} justify={decoded.id !== message?.sender._id ? "start" : "end"}>
              <Flex gap={4} style={{ width: "70%" }}>
                {decoded.id !== message?.sender._id && <Avatar size="large" src={message?.sender?.image} />}
                <Flex style={{ background: "#edede9", padding: 10, width: "100%", borderRadius: 10 }}>
                  <Typography.Text>{message.content}</Typography.Text>
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Flex>
        <Form form={form} onFinish={(values) => mutate(values)}>
          <Form.Item name={"taskId"} style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item name={"content"} rules={[{ required: true }]}>
            <Input.TextArea placeholder="Décrivez le problème ici..." name="content" />
          </Form.Item>
          <Space style={{ marginTop: 10 }}>
            <Button htmlType="submit" loading={isPending} disabled={isPending}>Envoyer</Button>
          </Space>
        </Form>
      </Modal>
    );
  };


  const id = window.location.pathname.split("/")[2];
  const navigate = useNavigate();

  const { data: taches, isLoading } = useQuery({
    queryKey: ["taches", id],
    queryFn: async () => {
      const response = await axiosInstance.get("/tasks");
      const tasks = response.data;
      const notesPromises = tasks.map(task => axiosInstance.get(`/notes?taskId=${task._id}`));
      const notesResponses = await Promise.all(notesPromises);

      const newNotesTasks = [];
      const tasksWithNotes = tasks.filter((task, index) => {
        const notes = notesResponses[index].data;
        if (notes.some(note => !note.read && !openedTasks.includes(task._id))) {
          newNotesTasks.push(task._id);
        }
        return notes.length > 0;
      });

      setTasksWithNotes(tasksWithNotes.map(task => task._id));
      setNewNotes(newNotesTasks);
      return tasks;
    },
  });

  const canAccess = () => {
    return getPermissions('Taches', 'create', decoded?.role);
  };
  const [newNotes, setNewNotes] = useState([]);
  const [openedTasks, setOpenedTasks] = useState([]); // Nouvel état pour suivre les tâches ouvertes

  const [text, setText] = useState("");
  const [filteredTaches, setFilteredTaches] = useState([]);

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
      render: (developer) => {
        return (
          <Flex align="center" gap={6}>
            <Avatar src={developer?.image}></Avatar>
            <span>{developer?.name}</span>
          </Flex>
        );
      }
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: "Etat",
      dataIndex: "etat",
      key: "etat",
      sorter: (a, b) => a.etat.localeCompare(b.etat),
      render: (etat) => {
        let color = "";
        switch (etat) {
          case "TODO":
            color = "green";
            break;
          case "INPROGRESS":
            color = "blue";
            break;
          case "done":
            color = "volcano";
            break;
          default:
            color = "default";
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
      title: 'Date Debut',
      dataIndex: 'dateDebut',
      key: 'dateDebut',
      render: (_, record) => {
        return <span>{dayjs(record.dateDebut).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: 'Date Fin',
      dataIndex: 'dateFin',
      key: 'dateFin',
      render: (_, record) => {
        return <span>{dayjs(record.dateFin).format('YYYY-MM-DD')}</span>;
      }
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Button
            danger
            onClick={() => {
              form.setFieldValue('taskId', record._id);
              setTaskId(record._id);
              setOpenSendProblem(true);
              setOpenedTasks([...openedTasks, record._id]); // Marquer la tâche comme ouverte
              setNewNotes(newNotes.filter(id => id !== record._id)); // Retirer la tâche de la liste des nouvelles notes
              setShowAlert(false); // Masquer l'icône d'alerte lorsque le modal est ouvert
            }}
            icon={<StopOutlined />}
          >
            {record.countMessages}
          </Button>
          {newNotes.includes(record._id) && (
            <ExclamationCircleOutlined style={{ color: 'red', marginLeft: 10 }} />
          )}
          <Button onClick={() => navigate(`/EditTaches/${record._id}`)}>Modifier</Button>
        </div>
      ),
    },
  ];
  const [showAlert, setShowAlert] = useState(false);


  const handleSearch = (value) => {
    setFilteredTaches(taches.filter((tache) => tache.nom.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    <Layout>
      <>
        {canAccess() && (
          <>
            <Button type="primary" onClick={() => setOpenCreateTask(true)}>
              Créer Tâche
            </Button>
            <ModalCreateTask />
          </>
        )}

        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">LES taches</h6>
        </div>
        <Input.Search
          placeholder="Rechercher une tâche par nom"
          onSearch={handleSearch}
          style={{ width: 200, margin: "10px 0" }}
          prefix={<SearchOutlined />}
        />
        <Card className="shadow mb-4">
          <div className="card-body">
            <div className="table-responsive">
              <Table
                dataSource={filteredTaches.length > 0 ? filteredTaches : taches}
                columns={columns}
                pagination={false}
                loading={isLoading}
                rowClassName={(record) => tasksWithNotes.includes(record._id) ? 'row-red' : ''}
              />
            </div>
          </div>
        </Card>
        <ModalDescription
          description={selectedDescription}
          visible={Boolean(selectedDescription)}
          onClose={() => setSelectedDescription("")}
        />
        <ModalSendProblem
          visible={openSendProblem}
          onClose={() => setOpenSendProblem(false)}
        />
      </>
    </Layout>
  );
};

export default GetAllT;
