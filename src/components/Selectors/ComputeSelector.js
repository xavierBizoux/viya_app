import React, { useEffect, useState, useContext, Fragment } from 'react';

import Instance from '../../apis/Instance';

import { AuthContext } from '../../contexts';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import LibrarySelector from './LibrarySelector';
import TableSelector from './TableSelector';
import Loading from '../Loading';

function ComputeSelector(props) {
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
        if ("compute" in authInfo.session && authInfo.session.compute !== undefined) {
            const endpoint = `/compute/sessions/${authInfo.session.compute}/data`;
            const headers = {
                "Accept": "application/vnd.sas.collection+json"
            }
            Instance.get(endpoint, { headers: headers })
                .then(response => {
                    const data = response.data.items.map(item => [item.name, item.id]);
                    setLibraries(data);
                    setLoading(false);
                });
        }
    }, [authInfo.session, setLoading]);

    useEffect(() => {
        setLoading(true);
        setSelectedTable(null);
        setTables([]);
        if (selectedLibrary !== null) {
            const endpoint = `/compute/sessions/${authInfo.session.compute}/data/${selectedLibrary}?limit=1000`;
            const headers = {
                "Accept": "application/vnd.sas.collection+json"
            };
            Instance.get(endpoint,{ headers: headers })
                .then(response => {
                    if ("items" in response.data) {
                        const data = response.data.items.map(item => [item.name, item.id]);
                        setTables(data);
                    }
                    setLoading(false);
                });
        }
    }, [selectedLibrary, authInfo.session.compute]);

    return (
        <Fragment>
            <Form onSubmit={props.onSelect} style={{ padding: 10 }}>
                <Form.Row>
                    <Col sm="4">
                        <LibrarySelector data={libraries} type="SAS" handleSelection={getSelectedLibrary} />
                    </Col>
                    <Col sm="7">
                        <TableSelector data={tables} type="SAS" disabled={selectedLibrary === null ? true : false} handleSelection={getSelectedTable} />
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

export default ComputeSelector;