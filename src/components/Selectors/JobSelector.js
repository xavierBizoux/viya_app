import React, { Fragment, useState, useContext, useEffect } from 'react';

import { Form, Col, Button } from 'react-bootstrap';

import { AuthContext } from '../../contexts';

import Instance from '../../apis/Instance';

import LibrarySelector from '../Selectors/LibrarySelector';
import TableSelector from '../Selectors/TableSelector';
import Loading from '../Loading';

function JobSelector(props) {
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
        if (authInfo.authenticated === true && authInfo.csrf.job !== undefined) {
            setLoading(true);
            const endpoint = "SASJobExecution/";
            const headers = {
                'X-CSRF-HEADER': 'X-CSRF-TOKEN',
                'X-CSRF-TOKEN': authInfo.csrf.job
            }
            const params = {
                _program: "/gelcontent/Demo/VISUAL/Jobs/extractData",
                reqType: "getlibraries"
            }
            Instance.get(endpoint, { headers: headers, params: params })
                .then(response => {
                    const data = response.data.map(element => [element.libname]);
                    setLibraries(data);
                    setLoading(false);
                });
        }
    }, [authInfo.authenticated, authInfo.csrf, setLoading]);

    useEffect(() => {
        setLoading(true);
        setSelectedTable(null);
        setTables([]);
        if (selectedLibrary !== null) {
            const endpoint = "SASJobExecution/";
            const headers = {
                'X-CSRF-HEADER': 'X-CSRF-TOKEN',
                'X-CSRF-TOKEN': authInfo.csrf.job
            }
            const params = {
                _program: "/gelcontent/Demo/VISUAL/Jobs/extractData",
                reqType: "gettables",
                lib: selectedLibrary
            }
            Instance.get(endpoint, { headers: headers, params: params })
                .then(response => {
                    const data = response.data.map(element => [element.memname]);
                    setTables(data);
                    setLoading(false);
                });
        }
    }, [selectedLibrary, authInfo.csrf.job]);

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
    );
}

export default JobSelector;