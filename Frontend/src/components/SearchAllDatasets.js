import React, { useState, useRef } from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, Input } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import { Button } from 'reactstrap';

function SearchAllDatasets(props) {
    const [inputValue, setInput] = useState('');
    const el = useRef(); // accesing input element

    const handleChange = (event) => {
        const userInput = event.target.value;
        setInput(event.target.value);
    };

    const handleClick = () => {
        props.queryAllDatasets(inputValue);
    };

    return (
        <Col md={{ size: 7 }}>
            <InputGroup style={{ width: '6' }} >
                <Input ref={el} onChange={handleChange} placeholder="Search similar datasets here" />
                <InputGroupAddon addonType="append">
                    <Button onClick={handleClick} style={{ backgroundColor: '#FFD466', color: 'grey' }}>Search</Button>
                </InputGroupAddon>
            </InputGroup>
        </Col>
    );
}

export default SearchAllDatasets;