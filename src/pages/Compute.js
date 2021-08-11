import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Instance from '../apis/Instance';

import { AuthContext } from '../contexts';

import Container from 'react-bootstrap/Container';

import ComputeSelector from '../components/Selectors/ComputeSelector';
import TableViewer from '../components/TableViewer/TableViewer';
import Loading from '../components/Loading';
import axios from 'axios';

function Compute() {
    const { authInfo, setAuthInfo } = useContext(AuthContext);
    const [selection, setSelection] = useState({ library: null, table: null });
    const [tableData, setTableData] = useState({ rows: [], columns: [] });
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (authInfo.authenticated === false) {
            history.push("/logon");
        }
    }, [authInfo.authenticated, history]);

    useEffect(() => {
        if (authInfo.authenticated === true && !("compute" in authInfo.session)) {
            const endpoint = '/compute/contexts';
            const headers = {
                'Accept': 'application/vnd.sas.collection+json',
                'Accept-Item': 'application/vnd.sas.compute.context+json'
            };
            Instance.get(endpoint, { headers: headers })
                .then(response => {
                    const [context] = response.data.items.filter(element => element.name.includes("SAS Studio") ? element : null);
                    const [link] = context.links.filter(element => element.rel === "createSession" ? element : null);
                    const headers = {
                        'Accept': link.responseType + '+json',
                        'Content-Type': link.type + '+json'
                    };
                    Instance(link.href, { method: link.method, headers: headers })
                        .then(response => {
                            setAuthInfo({ ...authInfo, session: { ...authInfo.session, compute: response.data.id } });
                        });
                });
        }
    }, [authInfo, setAuthInfo]);

    useEffect(() => {
        if (authInfo.session.compute !== "" && selection.table !== null) {
            const endpoint = `/compute/sessions/${authInfo.session.compute}/data/${selection.library}/${selection.table}`;
            const headers = {
                "Accept": "application/vnd.sas.compute.data.table+json"
            };
            Instance.get(endpoint, { headers: headers })
                .then(response => {
                    const rowCount = response.data.rowCount;
                    const columnCount = response.data.columnCount;
                    const headers = {
                        "Accept": "application/vnd.sas.collection+json"
                    };
                    const endpointRows = `/compute/sessions/${authInfo.session.compute}/data/${selection.library}/${selection.table}/rows?limit=${rowCount}`;
                    const endpointColumns = `/compute/sessions/${authInfo.session.compute}/data/${selection.library}/${selection.table}/columns?limit=${columnCount}`;
                    axios.all([
                        Instance.get(endpointRows, { headers: headers }),
                        Instance.get(endpointColumns, { headers: headers })
                    ]).then(axios.spread((rows, columns) => {
                        if (rows.data.items.length > 0 && columns.data.items.length > 0) {
                            const columnsData = columns.data.items.map(item => ({ name: item.name, label: item.label }));
                            const rowsData = rows.data.items.map(item => (item.cells));
                            setTableData({ rows: rowsData, columns: columnsData });
                        }
                    }));
                });
        };
    }, [selection, authInfo.session]);

    const handleSelection = (event) => {
        event.preventDefault();
        setTableData({ rows: [], columns: [] });
        setLoading(true);
        const selection = { library: event.target[0].value, table: event.target[1].value };
        setSelection(selection);
    };

    return (
        <Container className="justify-content-md-center">
            <ComputeSelector onSelect={handleSelection} />
            {tableData.rows.length !== tableData.columns.length ? <TableViewer data={tableData} /> : <Loading status={loading} />}
        </Container>
    )
}

export default Compute;