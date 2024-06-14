import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { DollarOutlined, DeleteOutlined } from '@ant-design/icons'; // Importez les icônes nécessaires

const ExpensesTable = ({ expensesData, onDelete }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Montant',
            dataIndex: 'montant',
            key: 'montant',
            render: (text, record) => <span><DollarOutlined /> {text}</span>, // Ajoutez l'icône Dollar à côté du montant
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (text, record) => (
                <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
                    Supprimer
                </Button>
            ),
        },
    ];

    const handleDelete = (id) => {
        setSelectedExpense(id);
        setModalVisible(true);
    };

    const handleConfirmDelete = () => {
        onDelete(selectedExpense);
        setModalVisible(false);
    };

    const handleCancelDelete = () => {
        setSelectedExpense(null);
        setModalVisible(false);
    };

    return (
        <>
            <Table dataSource={expensesData} columns={columns} />

            <Modal
                title="Confirmation de suppression"
                visible={modalVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okText="Confirmer"
                cancelText="Annuler"
            >
                Êtes-vous sûr de vouloir supprimer cette dépense ?
            </Modal>
        </>
    );
};

export default ExpensesTable;
