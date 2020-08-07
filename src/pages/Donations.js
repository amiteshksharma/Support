import React from 'react';
import '../css/Donations.css';
import Bar from '../components/Bar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tile from '../components/Tile';
import { withRouter } from 'react-router-dom';
import { InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';

class Email extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        Donations: [],
        Loading: false,
        Search: ''
      }

      this.searchResults = this.searchResults.bind(this);
      this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem('search')) {
      this.setState({Search: sessionStorage.getItem('search'), Text: sessionStorage.getItem('search')});
    }

    if(sessionStorage.getItem('results')) {
      this.setState({Donations: JSON.parse(sessionStorage.getItem('results'))});
    }
  }

  onKeyPress(e) {
    console.log(e);
    if(e.which === 13) {
      this.searchResults();
    }
  }

  searchResults() {
    console.log("here");
    this.setState({Loading: true})
    fetch("/scraper", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        search: this.state.Search
      })
    })
    .then(response => response.json())
    .then(data => {
      this.setState({Donations: data, Loading: false, Text: this.state.Search});
      sessionStorage.setItem('search', this.state.Search);
      sessionStorage.setItem('results', JSON.stringify(this.state.Donations));
    });        
  }

  
  render() {
    return (
      <div className="Donations">
        <Bar active={"2"} />

        <div className="donation-search">
          <InputGroup className="mb-3 w-100" onSubmit={() => this.searchResults()}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Search for Donations"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={this.state.Search}
              onChange={(e) => this.setState({Search: e.target.value}, () => console.log(this.state.Search))}
              onKeyPress={(e) => this.onKeyPress(e)}
            />
            <InputGroup.Append>
              <Button onClick={() => this.searchResults()}>Search</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>

        <span className="donation-results">
          {this.state.Donations.length !== 0 && !this.state.Loading ? <h1>Showing results for "{this.state.Text}" (All {this.state.Donations.length} results)</h1> : null}
        </span>

        <div className="donation-display">
          <section className="donation-content">
            {this.state.Loading ? <div className="loading"><Spinner animation="border" variant="info"/></div> : this.state.Donations.map(donation => (
                <Tile title={donation.Title} text={donation.Text}
                    link={donation.Link} raised={donation.Raised}
                    image={donation.Image} />
            ))  }
          </section>
        </div>
      </div>
    );
  }
}

export default withRouter(Email);
