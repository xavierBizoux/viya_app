import { useEffect, useState, useContext } from 'react';
import { useHistory} from 'react-router-dom';
import Instance from '../apis/Instance';

import { AuthContext } from '../contexts';

import Container from 'react-bootstrap/Container';

import CASSelector from '../components/Selectors/CASSelector';
import TableViewer from '../components/TableViewer/TableViewer';
import Loading from '../components/Loading';

function CAS() {
    const { authInfo, setAuthInfo } = useContext(AuthContext);
    const [selection, setSelection] = useState({ library: null, table: null });
    const [tableData, setTableData] = useState({ rows: [], columns: [] });
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (authInfo.authenticated === false) {
            history.push("/logon");
        }
    },[authInfo.authenticated, history]);

    useEffect(() => {
        if (authInfo.authenticated === true && !("cas" in authInfo.session) ) {
            const endpoint = '/cas-shared-default-http/cas/sessions';
            Instance.post(endpoint)
                .then(response => {
                    setAuthInfo({ ...authInfo, session: { ...authInfo.session, cas: response.data.session }});
                })
        }
    }, [authInfo, setAuthInfo]);

    useEffect(() => {
        if (authInfo.session.cas !== "" && selection.table !== null) {
            const endpoint = `/cas-shared-default-http/cas/sessions/${authInfo.session.cas}/actions/table.fetch`;
            const data = {
                "table":{
                    "caslib":selection.library,
                    "name":selection.table
                }
            }
            const headers = {
                "accept": "application/json",
                "content-type": "application/json"
            };
            Instance.post(endpoint, data,{headers: headers} )
                .then(response => {
                    if (response.data.results.Fetch.schema.length > 0) {
                        const result = response.data.results.Fetch;
                        setTableData({ rows: result.rows, columns: result.schema });
                    }
                });
        }
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
            <CASSelector onSelect={handleSelection}/>
            {tableData.rows.length !== tableData.columns.length ? <TableViewer data={tableData} /> : <Loading status={loading} />}
        </Container>
    )
};

export default CAS;