import { Modal, ModalHeader, ModalBody, Button, Row, Col} from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

function DeleteOneModel(props) {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
        if(props.onChange){
            props.onChange(!isModalOpen);
        }
    };

    // while a user chooses not to delete a model
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    //while a user chooses to delete a model
    const handleYesBtn= () => {
        props.deleteModel(props.deletedFileName, sessionStorage.getItem('verifiedUsername'));
        setModal(!isModalOpen);
    }

    return (
        <div>
            <IconButton aria-label="delete a model" component="span">
                <DeleteIcon data-testid="delete-model" onClick={toggleModal} />
            </IconButton>

            <Modal isOpen={isModalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Model Delete</ModalHeader>
                <ModalBody>
                    <p>Do you want to delete this model?</p>
                    <Row>
                        <Col>
                            <Button onClick={handleYesBtn} style={{backgroundColor: '#378CC6'}}>Yes</Button>
                        </Col>
                        <Col>
                            <Button onClick={handlenNoBtn}>No</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </div>

    );
}

export default DeleteOneModel;
