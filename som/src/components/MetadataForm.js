import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Button, Row, Col, Label, Container } from 'reactstrap';
import { Control, LocalForm, Form, Errors, actions } from 'react-redux-form';
import ReactTagInput from "@pathofdev/react-tag-input";
import { Link } from 'react-router-dom';
import { IconButton, Modal } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import "@pathofdev/react-tag-input/build/index.css";

function MetadataForm(props) {

    const FileName = localStorage.getItem('datasetname-metadata');
    console.log("local get file name: ", FileName);

    const BriefInfo = props.metadata.BriefInfo !== "" ? props.metadata.BriefInfo : "Please input a brief description for the dataset";
    const Description = props.metadata.Description !== "" ? props.metadata.Description : "Please input a detailed description for the dataset";
    const Source = props.metadata.Source !== "" ? props.metadata.Source : "Please input the source";
    const Keywords = props.metadata.Keywords.length !== 0 ? String(props.metadata.Keywords) : "Type and press Enter";
    const AttrLen = props.metadata.AttrInfo.length !== 0 ? props.metadata.AttrInfo.length : attr;
    const AttrInfo = props.metadata.AttrInfo.map(eachAttr => eachAttr);
    console.log("Attr Info check", AttrInfo);

    const [tags, setTags] = useState([]);
    const [attr, setAttr] = useState(AttrLen);


    const handleSubmit = (values) => {
        const attrInfo = integrateAttrInfo(attr, values);
        const fixedValue = fixEmptyForm(values, tags, attrInfo);
        console.log('Current State is: ' + JSON.stringify(fixedValue));

        // 'props.submitMetadata' is from Redux actionCreators, which is used to post the metadata to the backend server
        props.submitMetadata(fixedValue);
        alert(`Current State is:  ${JSON.stringify(fixedValue)}`);
        //props.resetMetadata();
        props.fetchDatasetFiles();
    };

    const TagInputs = (tags) => {
        const { model, dispatch } = props;
        return <ReactTagInput tags={tags} onChange={(newTags) => setTags(newTags)} onCustomChange={e => dispatch(actions.change(model, e))} />
    };

    const handleAddClick = () => {
        setAttr(attr + 1);
    };

    const handleRemoveClick = () => {
        if (attr > 1) {
            setAttr(attr - 1);
        } else {
            setAttr(1);
        }
    };

    const AttrRow = (attrNum, showButtons) => {

        const AttrName = AttrInfo[attrNum-1] == undefined || AttrInfo[attrNum-1].attrName === ""  ?  "attribute name" : AttrInfo[attrNum-1].attrName;
        const AttrDescription = AttrInfo[attrNum-1] == undefined || AttrInfo[attrNum-1].attrDescription === "" ? "attribute description" : AttrInfo[attrNum-1].attrDescription;
        

        if (showButtons) {
            return (
                <Row>
                    <Label md={2} className="attribute" htmlFor="attrInfo">{`Attribute${attrNum}: `}</Label>
                    <Label className="attribute" htmlFor="attrName"></Label>
                    <Col className="align-item-center">
                        <Control.text md={1} model={`.attrName${attrNum}`} id={`.attrName${attrNum}`} name="attrName" placeholder={AttrName} className="form-control" />
                    </Col>

                    <Label className="attribute" htmlFor="attrDescription"></Label>
                    <Col className="align-item-center">
                        <Control.text md={1} model={`.attrDescription${attrNum}`} id={`.attrDescription${attrNum}`} name="attrInfo" placeholder={AttrDescription} className="form-control" />
                    </Col>

                    <Col>
                        <Row>
                            <IconButton onClick={handleAddClick} aria-label="add an attribute" component="span">
                                <AddIcon />
                            </IconButton>
                            <IconButton onClick={handleRemoveClick} aria-label="remove an attribute" component="span">
                                <RemoveIcon />
                            </IconButton>
                        </Row>
                    </Col>
                </Row>
            );
        }
        else {
            return (
                <Row>
                    <Label md={2} className="attribute" htmlFor="attrInfo">{`Attribute${attrNum}: `}</Label>
                    <Label className="attribute" htmlFor="attrName"></Label>
                    <Col className="align-item-center">
                        <Control.text md={1} model={`.attrName${attrNum}`} id={`.attrName${attrNum}`} name="attrName" placeholder={AttrName} className="form-control" />
                    </Col>

                    <Label className="attribute" htmlFor="attrDescription"></Label>
                    <Col className="align-item-center">
                        <Control.text md={1} model={`.attrDescription${attrNum}`} id={`.attrDescription${attrNum}`} name="attrInfo" placeholder={AttrDescription} className="form-control" />
                    </Col>

                    <Col>
                        <Row>
                            <IconButton className="nodisplay" aria-label="add an attribute" component="span">
                                <AddIcon />
                            </IconButton>
                            <IconButton className="nodisplay" aria-label="remove an attribute" component="span">
                                <RemoveIcon />
                            </IconButton>
                        </Row>
                    </Col>
                </Row>
            );
        }

    };

    const AttrForm = (num) => {
        let arr = [];
        let attrArray = [];
        for (let i = 0; i < num; i++) {
            arr.push(AttrRow(i + 1, false));
        }
        return arr;
    };

    // this function is for integrate all attribution infos into an array
    // so that it can be send into the backend server as a whole
    const integrateAttrInfo = (attrNum, values) => {
        let attrInfo = [];

        for (let i = 0; i < attrNum; i++) {
            let attrIndex = `Attribute${i + 1}`;

            attrIndex = {
                // to identify if the attrName exists in the values (meaning if a user input words into it)
                // if not, then adding "" to attrName; if the user inputted, then keep the inputted value
                attrName: values[`attrName${i + 1}`] == null ? AttrInfo[i].attrName : values[`attrName${i + 1}`],
                attrDescription: values[`attrDescription${i + 1}`] == null ? AttrInfo[i].attrDescription : values[`attrDescription${i + 1}`]
            };

            attrInfo.push(attrIndex);
        }
        return attrInfo;
    };

    // this function is to fill up "" while a user input nothing in a form filed.
    const fixEmptyForm = (values, tags, attrInfo) => {
        let inputForm = ["FileName", "UserName", "BriefInfo", "Description", "Source", "Keywords", "AttrInfo"]
        let fixedForm = [];
        let fixedValue = {};
        console.log("attr len: ", attrInfo.length);
        console.log("attr info: ", attrInfo);

        const compareAttr = (attrInfo) => {
            const result = attrInfo.map((eachAttr, index) => {
                return eachAttr["attrName"] ==="" && eachAttr["attrDescription"] === "" ? "null" : "not-null"
            })
            console.log("attr compare: ", result);
            return result.includes("not-null");
        }

        for (let eachForm of inputForm) {
            switch (eachForm) {
                case "FileName":
                    fixedValue[eachForm] = props.dataset.FileName;
                    break;
                case "UserName":
                    fixedValue[eachForm] = props.dataset.UserName;
                    break;
                case "Keywords":
                    fixedValue[eachForm] = tags.length === 0 ? props.metadata.Keywords : tags
                    break;
                case "AttrInfo":
                    fixedValue[eachForm] = compareAttr(attrInfo) ? attrInfo : props.metadata.AttrInfo;
                    console.log("fixed Attr: ", fixedValue[eachForm]);
                    break;
                /**
                case "Label":
                    fixedValue[eachForm] = values[eachForm] == null ? "Unknown" : values[eachForm];
                    break;
                 */
                default:
                    fixedValue[eachForm] = values[eachForm] == null ? props. metadata[eachForm] : values[eachForm];
            }
        }
        fixedForm.push(fixedValue);

        return fixedForm;
    };

    useEffect(() => {
        // fetch the existing metadata first
        console.log("start refreshing metadata form")
        props.sendNameForDetailedData(FileName);
    });

    return (
        <Container>
            <Col className="metadata-info">
                <Row className="metadata-title">
                    <div className="title col-md-8">
                        <h4>Data Description - {FileName}</h4>
                    </div>
                </Row>
                <Row>

                </Row>


                <LocalForm onSubmit={(values) => handleSubmit(values)}>
                    <Col className="form-group">
                        <Row>
                            <Label htmlFor="BriefInfo" md="2">Brief descripton:</Label>
                            <Col>
                                <Control.text model=".BriefInfo" id="BriefInfo" name="BriefInfo"
                                    placeholder={BriefInfo}
                                    className="form-control" />
                            </Col>
                        </Row>
                    </Col>

                    <Col className="form-group">
                        <Label htmlFor="Description">Dataset description:</Label>
                        <Col md={10}>
                            <Control.textarea model=".Description" id="Description" name="Description"
                                row="6" className="form-control" placeholder={Description}/>
                        </Col>
                    </Col>

                    <Col className="form-group">
                        <Row>
                            <Label htmlFor="Source" md={1}>Source:</Label>
                            <Col>
                                <Control.text model=".Source" id="Source" name="Source"
                                    placeholder={Source}
                                    className="form-control" />
                            </Col>
                        </Row>
                    </Col>

                    {/** 
                    <Row className="form-group">
                        <Col md={5}>
                            <Label htmlFor="Number_of_Instance" md={10}>Number of instances:</Label>
                            <Col md={4}>
                                <Control.input model=".Number_of_Instance" id="Number_of_Instance" name="Number_of_Instance"
                                    className="form-control"
                                    min="0" type="number" step="1" />
                            </Col>
                        </Col>
                        <Col md={5}>
                            <Label htmlFor="Number_of_Attribute" md={10}>Number of attributes:</Label>
                            <Col md={4}>
                                <Control.input model=".Number_of_Attribute" id="Number_of_Attribute" name="Number_of_Attribute"
                                    className="form-control"
                                    min="0" type="number" step="1" />
                            </Col>
                        </Col>
                    </Row>
                    <Col className="form-group">
                        <Row>
                            <Label md={4}>Whether the dataset containes labels:</Label>
                            <Col md={2}>
                                <Control.select model=".Label" id="Label" name="Label"
                                    className="form-control">
                                    <option>Unknown</option>
                                    <option>Yes</option>
                                    <option>No</option>
                                </Control.select>
                            </Col>
                        </Row>
                    </Col>
                    */}

                    <Col className="form-group">
                        <Row>
                            <Label htmlFor="keywords" md={2}>Key words:</Label>
                            <Col>
                                <ReactTagInput tags={tags} onChange={(newTags) => setTags(newTags)} placeholder={Keywords}/>
                                <Control model=".keywords" id="keywords" name="keywords"
                                    value="test" className="form-control nodisplay" />
                            </Col>
                        </Row>
                    </Col>

                    <Col className="form-group"> {/**for loop */}
                        <Label style={{ backgroundColor: "aliceblue", width: "100%" }}>Attribute Information:</Label>
                        <Col>
                            {AttrForm(attr - 1)}
                            {AttrRow(attr, true)}
                        </Col>
                    </Col>

                    <div className="submit-button col-md-4 align-items-center">
                        <Button type="submit" style={{ backgroundColor: "#378CC6" }}>Submit</Button>
                    </div>

                </LocalForm>


            </Col>
        </Container>
    );
}

export default MetadataForm;