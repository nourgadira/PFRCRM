import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../Layout';
import { Button, DatePicker, Form, Input, Select, Card, Avatarr, Avatar, Flex, Typography } from "antd";
import { FolderAddOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { status } from '../data/selecteurs';
import { decodeToken } from '../lib/jwt'
import { axiosInstance } from '../lib/axios';
import { useParams } from '@reach/router';
const CreateTask = ({ setOpen }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const location = window.location.pathname
  const decoded = decodeToken(localStorage.getItem("token"))
  const { data, isLoading } = useQuery({
    queryKey: ['developpeurs'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users');
      console.log("Developpeurs Data:", response.data); // Affichage des données récupérées dans la console
      return response.data
    },
    select: (data) => {
      return data.filter(d => d.role === 1).flatMap((d) => {
        return {
          label: <Flex align={"center"} gap={4} ><Avatar src={d.image} style={{ width: "50px", height: "50px" }}></Avatar> <Typography.Title level={5}>{d.name}</Typography.Title></Flex>,
          value: d._id
        }
      })
    },
  })
  const id = location?.split("/")[2]
  const { data: projets, isLoading: isLoadingprojet } = useQuery({
    queryKey: ['projets'],
    queryFn: async () => {
      const response = await axiosInstance.get('/projets');// Affichage des données récupérées dans la console
      return response.data.projets
    },

  })
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data }) => {
      await axiosInstance.post('/tasks', { ...data })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tasks')
      setOpen(false)
    }
  })



  return (


    <Card title={<><FolderAddOutlined /> Créer une tâche</>} className="mb-4">
      <Form layout='vertical' form={form} onFinish={(values) => mutate({ data: { ...values, projet: id } })}>
        {/* Projet */}

        {/* État */}
        <Form.Item
          label="État"
          name="etat"
          initialValue="todo" // Définition de la valeur par défaut
          rules={[
            {
              required: true,
              message: 'Veuillez saisir un état',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nom"
          name="nom"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir un nom',
            },
          ]}
        >
          <Input suffix={<i className="fas fa-align-left" />} />
        </Form.Item>
        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir une description',
            },
          ]}
        >
          <Input.TextArea suffix={<i className="fas fa-align-left" />} />
        </Form.Item>
        {/* Date de début */}
        <Form.Item
          label="Date de début"
          name="dateDebut"
          rules={[
            {
              required: true,
              message: 'Veuillez sélectionner une date de début',
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        {/* Date de fin */}
        <Form.Item
          label="Date de fin"
          name="dateFin"
          rules={[
            {
              required: true,
              message: 'Veuillez sélectionner une date de fin',
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* Développeur */}
        <Form.Item
          label="Développeur"
          name="developpeur"
          rules={[
            {
              required: true,
              message: 'Veuillez sélectionner un développeur',
            },
          ]}
        >
          <Select
            options={data}
            allowClear
            loading={isLoading}
          />
        </Form.Item>


        {/* Bouton de soumission */}
        <Button htmlType='submit' type='primary' icon={<FolderAddOutlined />}>Créer la tâche</Button>
      </Form>
    </Card>


  );
};
export default CreateTask;
