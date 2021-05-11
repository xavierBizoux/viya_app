import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Instance from '../apis/Instance';

import { AuthContext } from '../contexts';

import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Logon() {
    const { authInfo, setAuthInfo } = useContext(AuthContext);
    const [alert, setAlert] = useState('');
    const history = useHistory();
    let userInput = React.createRef();
    let passwordInput = React.createRef();

    const authenticate = (event) => {
        event.preventDefault();
        setAlert('');
        const endpoint = "/SASLogon/oauth/token";
        const user = userInput.current.value;
        const password = passwordInput.current.value;
        const data = {
            grant_type: "password",
            response_type: "bearer",
            username: user,
            password: password
        };

        const headers = {
            'Authorization': "Basic " + btoa('gel_app:gel_secret'),
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        Instance.post(endpoint, new URLSearchParams(data), { headers: headers })
            .then(response => {
                if (response.status === 200) {
                    Instance.defaults.headers.common['Authorization'] = `${response.data.token_type} ${response.data.access_token}`;
                    setAuthInfo({ ...authInfo, authenticated: true, user: user, tokenInfo: response.data });
                    history.goBack();
                    return null;
                }
            }).catch(error => {
                Instance.defaults.headers.common['Authorization'] = null;
                setAlert(`User ${user} could not be authenticated, please check user name and password!`);
            });
    }

    return (
        <Container>
            <Form onSubmit={authenticate}>
                <Form.Row className='justify-content-md-center'>
                    <Col className='col-4'>
                        <Form.Control ref={userInput} type="input" placeholder="Login" />
                    </Col>
                    <Col className="col-4">
                        <Form.Control ref={passwordInput} type="password" placeholder="Password" />
                    </Col>
                    <Col className="col-1">
                        <Button variant="primary" type="submit">Logon</Button>
                    </Col>
                </Form.Row>
            </Form>
            <Row className="justify-content-md-center p-3">
                <Col md='{{span:10}}'>
                    {alert.length > 0 ? <Alert variant='danger'>{alert}</Alert> : null}
                </Col>
            </Row>
        </Container>
    )
}

export default Logon;