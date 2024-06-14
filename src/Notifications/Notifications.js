import { Avatar, Badge, Button, Dropdown, Flex, Spin, message } from 'antd';
import React from 'react'
import { axiosInstance } from '../lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BellFilled, ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons"
function Notifications() {
    const queryClient = useQueryClient()
    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/notifications`);
            return response.data
        },
        select: (data) => data?.flatMap(d => {
            return {
                ...d,
                message: JSON.parse(d?.message)
            }
        })
    })


    const { mutate, isPending } = useMutation({
        mutationFn: async (id) => {
            const response = await axiosInstance.post('/read', { id: id })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })

    const notReaded = notifications?.filter(notification => !notification.isRead)


    const items = notifications?.map(notification => {
        return {
            key: notification._id,
            label: <div style={{ width: "300px" }}>
                <Flex align='center' gap={8} style={{ padding: 4, borderRadius: 10, background: !notification.isRead ? "#edede9" : "" }} onClick={() => mutate(notification._id)}>
                    <Avatar shape="square" icon={<BellFilled />} style={{ width: 40, height: 40 }} />
                    <Flex vertical style={{ height: 40 }}>
                        <h1 style={{ fontSize: 12 }}>{notification.message.nom}</h1>
                        <Flex align='center' gap={4}>
                            <CalendarOutlined style={{ height: 20 }} />
                            <Flex gap={4} align='center'>
                                <div>{notification?.message?.dateDebut?.split('T')[0]}</div>
                                <ArrowRightOutlined />
                                <div>{notification?.message?.dateFin?.split('T')[0]}</div>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </div>,

        }
    })


    return (
        <>
            {
                isLoading ? <Spin /> : <Dropdown menu={{ items }} placement="bottomLeft">
                    <Badge count={notReaded?.length}>
                        <Avatar shape="square" icon={<BellFilled />} />
                    </Badge>
                </Dropdown>
            }
        </>
    )
}

export default Notifications
