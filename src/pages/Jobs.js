import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Instance from '../apis/Instance';

import { AuthContext } from '../contexts';

import Container from 'react-bootstrap/Container';

import JobSelector from '../components/Selectors/JobSelector';
import TableViewer from '../components/TableViewer/TableViewer';
import Loading from '../components/Loading';

function Jobs() {
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
        if (authInfo.authenticated === true && !("job" in authInfo.csrf)) {
            const endpoint = "SASJobExecution/csrf";
            Instance.get(endpoint)
                .then(response => {
                    setAuthInfo({ ...authInfo, csrf: { ...authInfo.csrf, job: response.data }});
                });
        }
    }, [authInfo, setAuthInfo]);

    useEffect(() => {
        if (selection.table !== null) {
            const endpoint = "SASJobExecution/";
            const headers = {
                'X-CSRF-HEADER': 'X-CSRF-TOKEN',
                'X-CSRF-TOKEN': authInfo.csrf.job
            }
            const params = {
                _program: "/gelcontent/Demo/VISUAL/Jobs/extractData",
                reqType: "getdata",
                lib: selection.library,
                ds: selection.table
            };
            Instance.get(endpoint, { headers: headers, params: params })
                .then(response => {
                    const rowsData = response.data.rows.map(row => {
                        const data = response.data.columns.map(col => row[col.name]);
                        return data;
                    })
                    setTableData({ columns: response.data.columns, rows: rowsData });
                    setLoading(false);
                });
        }
    }, [selection, authInfo.csrf]);

    const handleSelection = (event) => {
        event.preventDefault();
        setTableData({ rows: [], columns: [] });
        setLoading(true);
        const selection = { library: event.target[0].value, table: event.target[1].value };
        setSelection(selection);
    };

    return (
        <Container className="justify-content-md-center">
            <JobSelector onSelect={handleSelection} />
            {tableData.rows.length !== tableData.columns.length ? <TableViewer data={tableData} /> : <Loading status={loading} />}
        </Container>
    )
}

export default Jobs;