import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button, Label } from 'reactstrap';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { Card, CardText, CardBody, CardLink, CardTitle, CardSubtitle } from 'reactstrap';
import { Control, LocalForm, Form, Errors, actions } from 'react-redux-form';
import { Link } from 'react-router-dom';
import UMatrix from './Umatrix';
import qs from 'querystring';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TableChartIcon from '@material-ui/icons/TableChart';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import { Drawer, IconButton, Modal } from '@material-ui/core';

const drawerWidth = '30%';

const useStyles = makeStyles((theme) => ({
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        overflow: 'auto'
    },
    drawerPaper: {
        width: drawerWidth,
        overflow: 'auto'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
}));

function SingleVisualisation(props) {
    const [inputValue, setInput] = useState('');
    const el = useRef(); // accesing input element
    const [open, setOpen] = React.useState(true);
    const classes = useStyles();
    const theme = useTheme();

    const handleChange = (event) => {
        const userInput = event.target.value;
        const modelName = userInput.split(':');
        setInput(event.target.value.split(':')[0]);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
        if(props.onChange){
            props.onChange(true);
        }
    };

    const handleDrawerClose = () => {
        setOpen(false);
        if(props.onClose){
            props.onClose(false);
        }
    };

    useEffect(() => {
        const query = qs.parse(window.location.search.split('?')[1] || '')
        const ModelName = query.fileName;
        const UserName = query.userName
        // console.log("local get model name: ", ModelName);
        // console.log("local get user name: ", UserName);

        if (ModelName !== undefined) {
            props.getUMatrixDatasets(ModelName, UserName);
        }
    });


    return (
        <Container style={{ overflow: 'auto' }}>
            <Row>
                <AppBar style={{ backgroundColor: "white" }} position="relative">
                    <Toolbar>
                        <Typography variant="h6" noWrap className="title col-md-18">
                            <h4>U-Matrix</h4>
                            {/* <h4>U-Matrix: {props.umatrixDatasets == undefined || props.umatrixDatasets.length == 0 ? "" : UmatrixModelName}</h4> */}
                        </Typography>
                        <Button aria-label="open drawer" edge="end"
                            id={"select model"}
                            data-testid = "select model"
                            onClick={handleDrawerOpen}
                            className={clsx(open && classes.hide)}>
                            SelectModel
                        </Button>
                    </Toolbar>
                </AppBar>
            </Row>

            <Row className="umatrix" style={{ paddingTop: '5%', width: "100vw" }}>
                {props.umatrixDatasets.length !== 0 && (<UMatrix hexagonSize={20} model={props.umatrixDatasets[0]} />)}
            </Row>

            <Drawer
                id={'drawer'}
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose} data-testid="close-drawer">
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>

                <Divider />
                <br />

                <LocalForm>
                    <Col className="form-group">
                        <Row>
                            <Col>
                                <Control.select model=".bindedModel" id="bindedModel" name="bindedModel"
                                    onChange={handleChange}
                                    className="form-control">
                                    <option>---Please select a model in your models---</option>
                                    {props.modelFiles.map(eachModel => <option>{`${eachModel.FileName}: ${eachModel.BriefInfo}`}</option>)}
                                </Control.select>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Link to={`/visualisation/${inputValue}?userName=${sessionStorage.getItem('verifiedUsername')}&fileName=${inputValue}`}>
                            <Button id={'get-umatrix'} type="submit">get umatrix</Button>
                        </Link>
                    </Col>
                </LocalForm>
                <br />
                <div>
                    {props.umatrixDatasets.length !== 0 &&
                        (<Card>
                            <CardBody>
                                <CardTitle><strong>Model:</strong></CardTitle>
                                {props.umatrixDatasets[0].FileName}
                                <CardText>
                                    <small className="text-muted">{props.umatrixDatasets[0].BriefInfo}</small>
                                </CardText>
                            </CardBody>

                            <CardBody>
                                <CardTitle><strong>Datasets:</strong></CardTitle>
                                {props.umatrixDatasets.length > 1 && props.umatrixDatasets.slice(1, props.umatrixDatasets.length).map(dataset =>
                                    <CardText>
                                        {dataset.FileName} <br />
                                        <small className="text-muted">{dataset.BriefInfo}</small>
                                    </CardText>
                                )}
                            </CardBody>
                        </Card>)}
                </div>
            </Drawer>
        </Container>
    );
}

export default SingleVisualisation;