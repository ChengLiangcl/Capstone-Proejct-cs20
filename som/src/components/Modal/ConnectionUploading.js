import { Modal, ModalHeader, ModalBody, Button, Row, Col} from 'reactstrap';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, TableRow } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import ConnectionUploading from '../ConnectionUploading';

function ConnectUploading(props) {
    const [isModalOpen, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!isModalOpen);
        if(props.onChange){
            props.onChange(!isModalOpen);
        }
    };

    const closeModal = () => {
        setModal(!isModalOpen);
        props.fetchModelFiles(sessionStorage.getItem('verifiedUsername'));
        props.fetchDatasetFiles(sessionStorage.getItem('verifiedUsername'));
    }

    // while a user chooses not to delete a dataset
    const handlenNoBtn = () => {
        setModal(!isModalOpen);
    };

    return (
        <div>
            <IconButton aria-label="connect uploading" component="span">
                <PublishIcon data-testid="model-upload" onClick={toggleModal} />
            </IconButton>

            <p style={{color: "grey"}}>Please upload your model and datasets here</p>

            <Modal isOpen={isModalOpen} centered={true}>
                <ModalHeader toggle={closeModal}>Upload your model and datasets</ModalHeader>
                <ModalBody>
                    <ConnectionUploading connectUploading={props.connectUploading}
                            connectionFiles = {props.connectionFiles}
                            clearConnectionFiles = {props.clearConnectionFiles}/>
                </ModalBody>
            </Modal>
        </div>

    );
}

export default ConnectUploading;