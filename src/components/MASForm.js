import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function MASForm(props) {
    const [formElements, setFormElements] = useState({
        '1': { label: "Cholesterol level", min: 50, max: 600, variable: "Cholesterol", value: null, type: "range" },
        '2': { label: "Diastolic level", min: 50, max: 400, variable: "Diastolic", value: null, type: "range" },
        '3': { label: "Systolic level", min: 25, max: 200, variable: "Systolic", value: null, type: "range" },
        '4': { label: "Cigarets/day", min: 0, max: 100, variable: "Smoking", value: null, type: "range" },
        '5': { label: "Age At Start", min: 1, max: 150, variable: "AgeAtStart", value: null, type: "range" },
        '6': { label: "Weight in lbs", min: 1, max: 500, variable: "Weight", value: null, type: "range" },
        '7': { label: "Sex", options: ['F', 'M'], variable: "Sex", value: "F", type: "dropdown" }
    });

    const handleEvaluate = (event) => {
        event.preventDefault();
        for (let element in formElements) {
            const data = formElements[element];
            if (data.value === null) {
                setFormElements({ ...formElements, [element]: data.min })
            };
        }
        props.onEvaluate(formElements);
    };

    const handleChange = (event, id) => {
        const update = formElements[id];
        update.value = parseInt(event.target.value);
        setFormElements({ ...formElements, [id]: update })
    };

    const elements = [];
    for (let element in formElements) {
        const data = formElements[element];
        switch (data.type) {
            case "range":
                if (data.value === null) { data.value = data.min };
                elements.push(
                    <Form.Group as={Row} key={element}>
                        <Col sm="2" style={{ padding: 8 }}>
                            <Form.Label>{data.label} :</Form.Label>
                        </Col>
                        <Col sm="2" style={{ padding: 12 }}>
                            <Form.Control
                                type="range"
                                min={data.min}
                                max={data.max}
                                value={data.value}
                                onChange={e => handleChange(e, element)}
                            />
                        </Col>
                        <Col sm="1">
                            <Form.Control
                                type="input"
                                value={data.value}
                                onChange={e => handleChange(e, element)}
                            />
                        </Col>
                    </Form.Group>
                );
                break;
            case "dropdown":
                elements.push(
                    <Form.Group as={Row} key={element}>
                        <Col sm="2" style={{ padding: 8 }}>
                            <Form.Label>{data.label} :</Form.Label>
                        </Col>
                        <Col sm="1" style={{ padding: 12 }}>
                            <Form.Control
                                type="select"
                                as="select"
                                onChange={e => handleChange(e, element)}
                            >
                                {data.options.map((option) => <option key={option} value={option}>{option}</option>)}
                            </Form.Control>
                        </Col>
                    </Form.Group>
                );
                break;
            default:
                console.log('unknown form input type');
                break;
        }
    };
    return (
        <Row>
            <Col md={{ span: 12, offset: 1 }}>
                <h3>
                    Please set the values for the different risk factors:
                </h3>
                <Form onSubmit={handleEvaluate} style={{ padding: 10 }} >
                    {elements}
                    <Form.Group as={Row}>
                        <Col md={{ span: 12, offset: 2 }}>
                            <Button
                                variant="primary"
                                type="submit">
                                Evaluate
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Col>
        </Row >

    )
}

export default MASForm;