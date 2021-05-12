import GetAppIcon from '@material-ui/icons/GetApp';
import { Modal, ModalHeader, ModalBody, Button, Row, Col, Label, Input } from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import { Control, LocalForm, Form, Errors, actions } from 'react-redux-form';

function DownloadFile(props) {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
    };

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    const handleSubmit = (values) => {
        const newValue = values.bindedModel.split(':');
        console.log(newValue);
    };

    return (
        <div>
            <IconButton aria-label="delete a dataset" component="span">
                <GetAppIcon onClick={toggleModal}/>
            </IconButton>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Bind Model</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => handleSubmit(values)}>
                        <Col>
                            <Button type="submit" onClick={handlenNoBtn}>Bind</Button>
                        </Col>
                    </LocalForm>
                </ModalBody>
            </Modal>
        </div>

    );
}

export default DownloadFile;
