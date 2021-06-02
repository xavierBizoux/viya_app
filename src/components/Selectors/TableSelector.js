import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function TableSelector(props) {
    return (
        <Form.Group as={Row} controlId="formTableSelector" onChange={props.handleSelection}>
            <Form.Label style={{padding:8}}>{props.type} Table:</Form.Label>
            <Col sm="8">
                <Form.Control as="select" defaultValue="Choose a table!" disabled={props.disabled} className="mr-sm-2">
                    <option key="default" disabled >Choose a table!</option>
                    {props.data.map((element, index) => <option key={index}>{element[0]}</option>)}
                </Form.Control>
            </Col>
        </Form.Group>
    )
}

export default TableSelector;