import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function MASResults(props) {
    const details = [];
    for (let key in props.data) {
        details.push(<li key={key}>{key} : {props.data[key]}</li>)
    }

    return (
        <Row>
            <Col md={{ span: 12, offset: 1 }}>
                <details>
                    <summary>
                        The patient has {(props.data["P_StatusDead"] * 100).toFixed(2)}% to die of heart disease.
                    </summary>
                    <ul>
                        {details}
                    </ul>
                </details>
            </Col>
        </Row>
    );
}

export default MASResults;