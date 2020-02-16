import React from 'react';
import { Button, Form, Container, Row, Col, Image } from 'react-bootstrap';
import { HubConnectionBuilder } from '@microsoft/signalr';
import staffImage from './image/职员nan.png';
import azureImage from './image/azure.jpg'

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

class NoticeForm extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {noticeText: "", formText: ""};

        this.submitNotice = this.submitNotice.bind(this);
        this.changeNotice = this.changeNotice.bind(this);
    }

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl(`${apiBaseUrl}/api`)
            .build();

        connection.on('newNotice', this.newNotice);
        connection.start()
            .then(() => {
                console.log("connected");
            })
            .catch(error => {
                console.error(error.message)
            });
    }

    changeNotice(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    submitNotice(event) {
        event.preventDefault();

        fetch(`${apiBaseUrl}/api/notice`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.formText),
        });

        this.setState({
            formText: ""
        });
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col xs={{ span: 2, offset: 10 }}  md={{ span: 1, offset: 11 }}>
                        <Image src={staffImage} roundedCircle fluid className="border border-primary my-3" />
                    </Col>
                </Row>
                <Row>
                    <Col md="6" className="mb-3">
                        <Form onSubmit={this.submitNotice}>
                            <Form.Group controlId="ControlTextarea">
                                <Form.Control className="" style={{backgroundColor: 'rgba(255, 255, 255, 6%)'}} value={this.state.formText} onChange={this.changeNotice} name="formText" as="textarea" rows="10" placeholder="输入通知消息..."/>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="float-right">通知</Button>
                        </Form>
                    </Col>
                    <Col md="6">
                        <Image src={azureImage} fluid />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default NoticeForm;
