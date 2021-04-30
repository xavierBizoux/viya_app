import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../contexts';

function Cas() {
    const { authInfo } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        if (authInfo.authenticated === false) {
            history.push("/logon");
        }
    }, [authInfo.authenticated, history]);
    return (
        <h2>CAS page</h2>
    );
}

export default Cas;