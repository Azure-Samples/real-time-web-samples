import React from 'react';
import './App.css';
import { 
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import VideoPart from './VideoPart';
import ChartPart from './ChartPart';
import { Container, Row, Col } from 'react-bootstrap';
import NoticeForm from './NoticeForm';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin">
          <NoticeForm />
        </Route>
        <Route path="/">
          <Container fluid="true" className="mt-5 pt-2">
            <Row>
              <Col md="8" className="mb-3">
                  <VideoPart />
              </Col>
              <Col md="4">
                  <ChartPart />
              </Col>
            </Row>
          </Container>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
