import Table from 'react-bootstrap/Table';

function TableViewer(props) {
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    {props.data.columns.map((element, index) => {
                        return <th key={index} style={{ "textTransform": "capitalize" }}>{element.label.length > 0 ? element.label : element.name}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {props.data.rows.map((row, index) => {
                    return (
                        <tr key={index}>
                            {row.map((column, index) => <td key={index}>{column}</td>)}
                        </tr>);
                })}
            </tbody>
        </Table>
    );
}

export default TableViewer;