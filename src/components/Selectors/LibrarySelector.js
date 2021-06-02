import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function LibrarySelector(props) {
    return (
        <Form.Group as={Row} controlId="formLibrarySelector" onChange={props.handleSelection}>
            <Form.Label style={{padding:8}}>{props.type} Library:</Form.Label>
            <Col sm="8">
                <Form.Control as="select" defaultValue="Choose a library!">
                    <option key="default" disabled >Choose a library!</option>
                    {props.data.map((element, index) => <option key={index} >{element[0]}</option>)}
                </Form.Control>
            </Col>
        </Form.Group>
    );
}

export default LibrarySelector;