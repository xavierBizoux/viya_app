import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';

function Loading(props) {
    const spinner = (
        <Row className="justify-content-md-center">
            <Spinner animation="border" role="status" variant="primary" style={{ display: 'flex', justifyContent: 'center' }}>
                <span className="sr-only">Loading...</span>
            </Spinner>
        </Row>
    );
    return props.status ? spinner : null;
}

export default Loading;