import React, { useEffect, useState, useContext, Fragment } from 'react';

import Instance from '../../apis/Instance';

import { AuthContext } from '../../contexts';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import LibrarySelector from './LibrarySelector';
import TableSelector from './TableSelector';
import Loading from '../Loading';

function CASSelector(props) {
    const { authInfo } = useContext(AuthContext);
    const [libraries, setLibraries] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [loading, setLoading] = useState(false);

    const getSelectedLibrary = (selected) => {
        setSelectedLibrary(selected.target.value);
    }
    const getSelectedTable = (selected) => {
        setSelectedTable(selected.target.value);
    }

    useEffect(() => {
        setLoading(true);
        if ("cas" in authInfo.session && authInfo.session.cas !== undefined) {
            const endpoint = `/cas-shared-default-http/cas/sessions/${authInfo.session.cas}/actions/table.caslibInfo`;
            Instance.post(endpoint)
                .then(response => {
                    setLibraries(response.data.results.CASLibInfo.rows);
                    setLoading(false);
                });
        }
    }, [authInfo.session, setLoading]);

    useEffect(() => {
        setLoading(true);
        setSelectedTable(null);
        setTables([]);
        if (selectedLibrary !== null) {
            const endpoint = `/cas-shared-default-http/cas/sessions/${authInfo.session.cas}/actions/table.tableInfo`;
            const headers = {
                "accept": "application/json",
                "content-type": "application/json"
            };
            const data = { "caslib": selectedLibrary };
            Instance.post(endpoint, data, { headers: headers })
                .then(response => {
                    if ("results" in response.data) {
                        setTables(response.data.results.TableInfo.rows);
                    }
                    setLoading(false);
                });
        }
    }, [selectedLibrary, authInfo.session.cas]);

    return (
        <Fragment>
            <Form onSubmit={props.onSelect} style={{ padding: 10 }}>
                <Form.Row>
                    <Col sm="4">
                        <LibrarySelector data={libraries} type="CAS" handleSelection={getSelectedLibrary} />
                    </Col>
                    <Col sm="7">
                        <TableSelector data={tables} type="CAS" disabled={selectedLibrary === null ? true : false} handleSelection={getSelectedTable} />
                    </Col>
                    <Col sm="1">
                        <Button variant="primary" type="submit" disabled={selectedTable === null ? true : false} >
                            Display
                    </Button>
                    </Col>
                </Form.Row>
            </Form>
            <Loading status={loading} />
        </Fragment>
    )
}

export default CASSelector;