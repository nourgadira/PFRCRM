import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from 'antd';

import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import { jwtDecode } from "jwt-decode";
import { Avatar, Button, Flex, Form, Modal, Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import dayjs from "dayjs";
import { decodeToken } from "../lib/jwt";
import CreateTask from "./CreateTaches";
import UpdateTask from "./EditTaches";
import { getTaskByUserId } from "../helpers/helpers";
const TaskByProject = () => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // État pour stocker la tâche sélectionnée
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useParams();

  console.log(params);
  const decoded = decodeToken(localStorage.getItem("token"));

  const { data: taches, isLoading } = useQuery({
    queryKey: ["taches", params.idProject],
    queryFn: async () => {
      const response = await axiosInstance.get("/tasks");
      console.log(response);
      return response.data;
    },
    select: (data) => data.filter((d) => d.projet._id === params.idProject),
  });

  const columns = [
    {
      title: "Développeur",
      dataIndex: "developpeur",
      key: "developpeur",
      render: (_, record) => (
        <Flex align="center">
          <Avatar src={_?.image}></Avatar>
          <span>{_.name}</span>
        </Flex>
      ),
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Etat",
      dataIndex: "etat",
      key: "etat",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <Button type="link" onClick={() => handleOpenModal(record)}>
          Voir Description
        </Button>
      ),
    },
    {
      title: "Date Debut",
      dataIndex: "dateDebut",
      key: "dateDebut",
      render: (_, record) => (
        <span>{dayjs(record.dateDebut).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      title: "Date Fin",
      dataIndex: "dateFin",
      key: "dateFin",
      render: (_, record) => (
        <span>{dayjs(record.dateFin).format("YYYY-MM-DD")}</span>
      ),
    },
  ];

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  return (
    <Layout>
      <>

        {/* Afficher le nom du projet ici */}
        <div>
          {taches && taches.length > 0 && (
            <Card style={{ backgroundColor: '#f0f2f5', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', width: '200px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div>
                <h6 style={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Nom du Projet: {taches[0].projet.nom}</h6>
              </div>
            </Card>
          )}
        </div>
        <Card className="shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">  LES taches</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <Table dataSource={taches} columns={columns} loading={isLoading} />
            </div>
          </div>
        </Card>

        {/* Afficher le modal avec la description */}
        {selectedTask && (
          <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
            <h3>Description de la Tâche</h3>
            <p>{selectedTask.description}</p>
          </Modal>
        )}
      </>
      <Modal open={openUpdate} onCancel={() => setOpenUpdate(false)} footer={false}>
        <UpdateTask setOpen={setOpenUpdate} form={form} />
      </Modal>
    </Layout>
  );
};

export default TaskByProject;
