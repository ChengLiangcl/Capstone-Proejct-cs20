import React, {Component} from 'react';
import {InputGroup, Modal, ModalHeader, ModalBody, InputGroupAddon, Input} from 'reactstrap';
import {Container, Row, Col} from 'reactstrap';
import {Button} from 'reactstrap';
import {Table} from 'reactstrap';
import {IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import InsertChart from '@material-ui/icons/InsertChart';
import {Link} from 'react-router-dom';
import ModelUploadComponent from './ModelUploadComponent';
import DeleteOneModel from './DeleteOneModel';
import {Loading} from './LoadingComponent';


class SOMModel extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    open: false,
    description:'',
    editModelName:''
  }

  renderModelTable(models = [], isLoading) {
    if (isLoading) {
      return (
        <Loading/>
      );
    } else {
      return (
        <Table hover>
          <thead>
          <tr>
            <th>Model name</th>
            <th>Description</th>
            <th>Size(KB)</th>
            <th>Operation</th>
          </tr>
          </thead>
          <tbody>
          {models.map((model, index) =>
            <tr key={index}>
              <td style={{verticalAlign:'middle'}}>{model.FileName}</td>
              <td style={{verticalAlign:'middle'}}>{model.Description}</td>
              <td style={{verticalAlign:'middle'}}>{model.Size}</td>
              <td key={"operateEachModel"}>
                <IconButton aria-label="delete a dataset" component="span">
                  <DeleteOneModel deleteModel={this.props.deleteModel}
                                    deletedFileName={model.FileName} />
                </IconButton>

                <IconButton aria-label="create matadata" component="span" onClick={() => this.setState({open: true,description:model.Description,editModelName:model.FileName})}>
                  <CreateIcon/>
                </IconButton>

                <Link to={`/visualisation/${model.name}`}>
                  <IconButton aria-label="create matadata" component="span">
                    <InsertChart/>
                  </IconButton>
                </Link>
              </td>
            </tr>
          )}
          </tbody>
        </Table>
      );
    }
  }

  handleClose = () => {
    this.setState({open: false})
  }

  render() {
    return (
      <Container>
        <Col className="search-box">
          <Col md={{size: 7}}>
            <InputGroup style={{width: '6'}}>
              <Input placeholder="Search similar models here"/>
              <InputGroupAddon addonType="append">
                <Button style={{backgroundColor: '#378CC6'}}>Search</Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Col>
        <Col>
          <ModelUploadComponent uploadModel={this.props.uploadModel}/>
        </Col>
        <Col className="database">
          {this.renderModelTable(this.props.modelFiles, this.props.isLoading)}
        </Col>

        <Modal isOpen={this.state.open} toggle={this.handleClose} centered={true}>
          <ModalHeader toggle={this.handleClose}>Model Edit</ModalHeader>
          <ModalBody>
            <Input placeholder={'Model description'} value={this.state.description} onChange={event => this.setState({description:event.target.value}) }/>
            <Row>
              <Col>
                <Button onClick={()=>{
                  this.handleClose()
                  console.log(this.state.editModelName);
                  this.props.editModelDescription(this.state.editModelName,this.state.description)
                }} style={{backgroundColor: '#378CC6'}}>Yes</Button>
              </Col>
              <Col>
                <Button onClick={this.handleClose}>No</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </Container>
    );
  }
}

export default SOMModel;
