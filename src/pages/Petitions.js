import React from 'react';
import '../css/Petitions.css';
import Bar from '../components/Bar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Node from '../components/Node';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch} from '@fortawesome/free-solid-svg-icons'
import { InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';

class Email extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        Petitions: [],
        Loading: false,
        Search: '',
        Render: false
      }

      this.searchResults = this.searchResults.bind(this);
      this.onKeyPress = this.onKeyPress.bind(this);
      this.noResults = this.noResults.bind(this);
      this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    if(sessionStorage.getItem('search')) {
      this.setState({Search: sessionStorage.getItem('searchp'), Text: sessionStorage.getItem('searchp')});
    }

    if(sessionStorage.getItem('resultsp')) {
      this.setState({Petitions: JSON.parse(sessionStorage.getItem('resultsp'))});
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
    fetch("/scraper/petitions", {
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
      this.setState({Petitions: data, Loading: false, Text: this.state.Search}, () => {
        if(this.state.Petitions.length === 0) {
          this.setState({Render: true});
        }
      });
      sessionStorage.setItem('searchp', this.state.Search);
      sessionStorage.setItem('resultsp', JSON.stringify(this.state.Petitions));
    });        
  }

  noResults() {
    console.log(this.state.Petitions);
    if(this.state.Petitions.length === 0 && this.state.Render) {
      return (
        <h1 className="no-results-petition">No Results found for "{this.state.Search}"</h1>
      )
    }
  }

  clear() {
    this.setState({
      Petitions: [],
      Loading: false,
      Search: '',
      Render: false
    });

    sessionStorage.setItem('searchp', '');
    sessionStorage.setItem('resultsp', []);
  }

  
  render() {
    return (
      <div className="Petitions">
        <Bar active={"3"} />

        <div className="petition-search">
          <InputGroup className="mb-3 w-100" onSubmit={() => this.searchResults()}>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1"><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Search for Petitions"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={this.state.Search}
              onChange={(e) => this.setState({Search: e.target.value, Render: false}, () => console.log(this.state.Search))}
              onKeyPress={(e) => this.onKeyPress(e)}
            />
            <InputGroup.Append>
              <Button onClick={() => this.searchResults()}>Search</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>

        <span className="petition-results">
          {this.state.Petitions.length !== 0 && !this.state.Loading ? <h1>Showing results for "{this.state.Text}" (All {this.state.Petitions.length} results)</h1> : null}
        </span>

        <span className="clear-results">
          {this.state.Petitions.length !== 0 && !this.state.Loading ? <h1 onClick={() => this.clear()}>Clear Results</h1> : null} 
        </span>

        <div className="petition-display">
          <section className="petition-content">
            {this.state.Loading ? <div className="loading"><Spinner animation="border" variant="info"/></div> : this.state.Petitions.map(petition => (
                <Node title={petition.Title} text={petition.Text}
                    link={petition.Link} signatures={petition.Signatures}
                    image={petition.Image} user={petition.User} 
                    state={petition.State}
                    />
            ))}
          </section>
        </div>

        {this.noResults()}
      </div>
    );
  }
}

export default withRouter(Email);
