import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Emails from './pages/Emails';
import Donations from './pages/Donations';
import Petitions from './pages/Petitions';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Emails} />
            <Route exact path="/donations" component={Donations} />
            <Route exact path="/petitions" component={Petitions} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
