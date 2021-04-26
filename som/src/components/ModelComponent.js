import React, { Component } from 'react';
import { InputGroup, Modal, ModalHeader, ModalBody, InputGroupAddon, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';
import { Table } from 'reactstrap';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import InsertChart from '@material-ui/icons/InsertChart';
import { Link } from 'react-router-dom';
import ModelUploadComponent from './ModelUploadComponent';
import DeleteOneModel from './DeleteOneModel';
import ModelBriefInfo from './ModelBriefInfo';
import { Loading } from './LoadingComponent';
import ConnectUploading from './Modal/ConnectionUploading'
import SearchModel from './SearchModelComponent';


class SOMModel extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this.props.fetchModelFiles(sessionStorage.getItem('verifiedUsername'));
  }

  tableHead() {
    return (
      <thead>
        <tr>
          <th>Model name</th>
          <th>Description</th>
          <th>Size(KB)</th>
          <th>Operation</th>
        </tr>
      </thead>
    );
  }

  tableBody(models) {
    if (models.length === 0) {
      return (
        <tbody />
      );
    }
    else {
      return (
        <tbody>
          {models.map((model, index) =>
            <tr key={index}>
              <td style={{ verticalAlign: 'middle' }}>{model.FileName}</td>
              <td style={{ verticalAlign: 'middle' }}>{model.BriefInfo}</td>
              <td style={{ verticalAlign: 'middle' }}>{model.Size}</td>
              <td key={"operateEachModel"}>
                <Container>
                  <Row>
                    <DeleteOneModel deleteModel={this.props.deleteModel}
                      deletedFileName={model.FileName} />

                    <ModelBriefInfo editModelDescription={this.props.editModelDescription}
                      modelName={model.FileName}
                      fetchModelFiles={this.props.fetchModelFiles} />

                    <Link to={`/visualisation/${model.FileName}`}>
                      <IconButton aria-label="visualisation" component="span">
                        <InsertChart />
                      </IconButton>
                    </Link>
                  </Row>
                </Container>
              </td>
            </tr>
          )}
        </tbody>
      );
    }
  }

  renderModelTable(models = [], isLoading) {
    if (isLoading) {
      return (
        <Loading />
      );
    } else {
      return (
        <Table hover>
          {this.tableHead()}
          {this.tableBody(models)}
        </Table>
      );
    }
  }

  render() {
    return (
      <Container>
        <Col className="search-box" >
            <SearchModel queryModels={this.props.queryModels} />
        </Col>

        <Col>
          <ConnectUploading connectUploading={this.props.connectUploading}
            connectionFiles={this.props.connectionFiles}
            clearConnectionFiles={this.props.clearConnectionFiles} />
        </Col>

        <Col className="database">
          {this.renderModelTable(this.props.modelFiles, this.props.isLoading)}
        </Col>

      </Container>
    );
  }
}

export default SOMModel;
