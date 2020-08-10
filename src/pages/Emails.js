import React from 'react';
import '../css/Email.css';
import Bar from '../components/Bar';
import Messages from '../components/Messages';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Email extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        Query: this.props.location.state,
        Message: '',
        Email: '',
        Custom: '',
        EmailCustom: ''
      }

      this.changePage = this.changePage.bind(this);
      this.renderButtons = this.renderButtons.bind(this);
      this.sendEmail = this.sendEmail.bind(this);
  }

  changePage(queryname) {
      this.props.history.push({
        pathname: '/',
        search: `?page=${queryname}`,
        state: queryname
      });

      this.setState({Query: queryname}, () => this.setState({Message: Messages(this.state.Query)}))
  }

  sendEmail(email, message) {
    if(email.length === 0 || message.length === 0) {
      message = this.state.Message;
      return;
    }

    fetch("/email", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        message: message 
      }),
    }).then(response => response.text()).then(data => console.log(data));
  }

  renderButtons() {
    return (
      <div className="render-buttons">
        <section className="send-message">
          <h1>Send preset message</h1>
          <Container>
            <Row>
              <Col md={{ span: 8, offset: 2 }}>
                <Form>
                  <Form.Group controlId="formGroupPassword">
                    <Form.Label>Your email address</Form.Label>
                    <Form.Control type="email" placeholder="Ex) hello@gmail.com" 
                    onChange={(e) => this.setState({Email: e.target.value})} />
                  </Form.Group>
                </Form> 
              </Col>
            </Row>
            <Row>
              <Col md={{ span: 8, offset: 2 }}>
                <Form>
                  <Form.Group controlId="formGroupPassword">
                    <Form.Label>Preset Message</Form.Label>
                    <Form.Control type="text" value={this.state.Message} as="textarea" rows="20" 
                      readonly
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Container>

          <Button className="p-1 pr-5 pl-5" onClick={() => this.sendEmail(this.state.Email, this.state.Message)}>Submit!</Button>
        </section>

        <section className="custom-message">
          <h1>Send Custom Message</h1>
          <Container>
            <Row>
              <Col md={{ span: 8, offset: 2 }}>
                <Form>
                  <Form.Group controlId="formGroupPassword">
                    <Form.Label>Your email address</Form.Label>
                    <Form.Control type="email" placeholder="Ex) hello@gmail.com"
                      onChange={(e) => this.setState({EmailCustom: e.target.value})} />
                  </Form.Group>
                </Form> 
              </Col>
              <Col md={{ span: 8, offset: 2 }}>
                <Form>
                  <Form.Group controlId="formGroupPassword">
                    <Form.Label>Type Message</Form.Label>
                    <Form.Control type="text" placeholder="Message" as="textarea" rows="20"
                      onChange={(e) => this.setState({Custom: e.target.value})}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Container>  

          <Button className="p-1 pr-5 pl-5" 
          onClick={() => this.sendEmail(this.state.EmailCustom, this.state.Custom)}>
            Submit!
          </Button>
        </section>
      </div>
    )
  }
  
  render() {
    return (
      <div className="App">
        <Bar active={"1"} />
        <div className="app-display">
          <section className="sidebar-section">
            <div className="sidebar">
            <h1>Topics</h1>
            <hr />
              <ul className="sidebar-tabs">
                <li onClick={() => this.changePage("police")}>Defund the police</li>
                <li onClick={() => this.changePage("Breonna Taylor")}>Justice for Breonna Taylor</li>
                <li onClick={() => this.changePage("Minimum Wage")}>Increase minimum wage</li>
                <li onClick={() => this.changePage("Medical drugs")}>Lower costs of medical drugs</li>
                <li onClick={() => this.changePage("Immunity")}>End qualified immunity</li>
                <li onClick={() => this.changePage("Prison")}>Reforming prison systems</li>
                <li onClick={() => this.changePage("Marijuana")}>Legalize marijuana</li>
                <li onClick={() => this.changePage("ICE")}>End detention camps by ICE</li>
              </ul>
            </div>
          </section>

          <section className="content">
            {this.state.Query ? this.renderButtons() : null}
          </section>
        </div>
      </div>
    );
  }
}

export default withRouter(Email);
