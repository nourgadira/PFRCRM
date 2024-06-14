import React from 'react';
import Layout from '../Layout';
import { Avatar, Button, Form, Input, Row, Col, Spin, message, Card, Typography } from 'antd';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { axiosInstance } from '../lib/axios';
import { decodeToken } from '../lib/jwt';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
function Profile() {
    const [form] = Form.useForm();
    const decoded = decodeToken(localStorage.getItem('token'));
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['users', decoded.id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/users/${decoded.id}`);
            return response.data;
        }
    });

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axiosInstance.post(`/upload_image?id=${decoded.id}`, formData);
            const data = await response.data;
            console.log(data);
            message.success('Image uploaded successfully');
            queryClient.invalidateQueries(['users', decoded.id]);
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Failed to upload image');
        }
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onSubmit = async (values) => {
        axiosInstance.patch('/users/' + decoded.id, { ...values })
            .then(res => {
                queryClient.invalidateQueries({ queryKey: 'users_all' });
                message.success('User updated successfully');
            })
            .catch(() => {
                message.error('Problem updating user');
            });
    };

    return (
        <Layout>
            <Card style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Title level={3}>Modifier Profile</Title>
                </div>
                <Spin spinning={isLoading}>
                    <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Avatar src={data?.image} size={100} />
                        </Col>
                    </Row>
                    <Row justify="center" style={{ marginBottom: '20px' }}>
                        <Col>
                            <ImgCrop rotationSlider>
                                <Upload
                                    listType="picture-card"
                                    onPreview={onPreview}
                                    maxCount={1}
                                    beforeUpload={(file) => {
                                        handleUpload(file);
                                        return false;
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </ImgCrop>
                        </Col>
                    </Row>
                    <Form layout='vertical' form={form} onFinish={onSubmit}>
                        <Form.Item label="Nom" name="name" initialValue={data?.name} rules={[{ required: true, message: 'Veuillez saisir votre nom' }]}>
                            <Input placeholder="Nom" disabled />
                        </Form.Item>
                        <Form.Item label="Prénom" name="prenom" initialValue={data?.prenom} rules={[{ required: true, message: 'Veuillez saisir votre prénom' }]}>
                            <Input placeholder="Prénom" disabled />
                        </Form.Item>
                        <Form.Item label="Email" name="email" initialValue={data?.email} rules={[{ required: true, message: 'Veuillez saisir votre email' }]}>
                            <Input placeholder="Email" disabled />
                        </Form.Item>
                        <Form.Item label="Salaire Fixe" name="salairefixe" initialValue={data?.salairefixe} rules={[{ required: true, message: 'Veuillez saisir votre salaire fixe' }]}>
                            <Input placeholder="Salaire Fixe" disabled />
                        </Form.Item>
                        <Form.Item label="telephone" name="telephone" initialValue={data?.telephone} rules={[{ required: true, message: 'Veuillez saisir votre telephone' }]}>
                            <Input placeholder="telephone" />
                        </Form.Item>
                        <Form.Item label="cin" name="cin" initialValue={data?.cin} rules={[{ required: true, message: 'Veuillez saisir votre cin' }]}>
                            <Input placeholder="cin" disabled />
                        </Form.Item>
                        <Form.Item label="role" name="role" initialValue={data?.role} rules={[{ required: true, message: 'Veuillez saisir votre role' }]}>
                            <Input placeholder="role" disabled />
                        </Form.Item>
                        <Form.Item label="Prime" name="prime" initialValue={data?.prime} rules={[{ required: true, message: 'Veuillez saisir votre prime' }]}>
                            <Input placeholder="Prime" disabled />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>Enregistrer</Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </Layout>
    );
}

export default Profile;
