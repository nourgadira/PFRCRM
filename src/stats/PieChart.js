import React from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { decodeToken } from '../lib/jwt';

export const PieChart = () => {
    const decoded = decodeToken(localStorage.getItem('token'))
    const { data: tasks } = useQuery({
        queryKey: ["pieChart"],
        queryFn: async () => {
            const response = await axiosInstance.get('/tasks')
            return response.data
        },

    })


    const done = tasks?.filter(task => task.etat === "done")?.length
    const todo = tasks?.filter(task => task.etat === "todo")?.length
    const inProgress = tasks?.filter(task => task.etat === "INPROGRESS")?.length
    const config = {
        data: [
            { type: 'todo', value: todo },
            { type: 'done', value: done },
            { type: 'IN_PROGRESS', value: inProgress },

        ],
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };
    return <Pie {...config} />;
};

