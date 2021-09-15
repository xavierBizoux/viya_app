import { useEffect, useState, useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import Instance from '../apis/Instance';

import { AuthContext } from '../contexts';

import MASForm from '../components/MASForm';
import MASResults from '../components/MASResults';
import Loading from '../components/Loading';

function Mas() {
    const { authInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [scoreData, setScoreData] = useState({});
    const [message, setMessage] = useState();
    const history = useHistory();

    useEffect(() => {
        if (authInfo.authenticated === false) {
            history.push("/logon");
        }
    }, [authInfo.authenticated, history]);

    const handleEvaluate = (selection) => {
        setLoading(true)
        const endpoint = 'microanalyticScore/modules/heart_attack_prediction/steps/score';
        const headers = {
            'Content-Type': 'application/vnd.sas.microanalytic.module.step.input+json',
            'Accept': 'application/vnd.sas.microanalytic.module.step.output+json'
        };
        const formData = { inputs: [] };
        for (let element in selection) {
            const data = selection[element];
            formData.inputs.push({ name: data.variable, value: data.value });
        };

        Instance.post(endpoint, formData, { headers: headers })
            .then(response => {
                if (response.status === 201 && response.data.executionState === "completed") {
                    const output = {};
                    response.data.outputs.forEach(variable => output[variable.name] = variable.value);
                    setScoreData(output);
                    setLoading(false);
                } else {
                    setMessage("Please try again!");
                }
            });
    };

    return (
        <Fragment>
            <MASForm onEvaluate={handleEvaluate} />
            <Loading status={loading} />
            { Object.keys(scoreData).length === 0 ? null : <MASResults data={scoreData} message={message} />}
        </Fragment>
    )
}

export default Mas;