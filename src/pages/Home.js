import { Card, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import PAGES from '../data/PAGES';

function Home() {
    const history = useHistory();
    function handleClick(href) {
        history.push(href);
    }
    return (
        <Row>
            {PAGES.map((page, index) =>
                <Col key={index} xs={6}  style={{ padding: 10 }}>
                    <Card onClick={() => handleClick(page.href)}>
                        <Card.Header style={{ padding: 20 }}>
                            {page.label}
                        </Card.Header>
                        <Card.Body>
                            {page.description}
                        </Card.Body>
                    </Card>
                </Col>
            )}
        </Row>
    )
}

export default Home;