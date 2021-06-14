import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import Board from './components/board';
import BoardDetails from './components/board_details';
import BoardWrite from './components/board_write';
// import VBoard from './components/v_board';

class App extends React.Component {
  // constructor(props) {
  //   super(props);

  // }


  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/* <Route path="/board/:communityIdx"  render={(props) => <VBoard        {...props}/>}/> */}
          <Route path="/board/:postIdx"       render={(props) => <BoardDetails {...props}/>}/>
          <Route path="/board/write"          render={(props) => <BoardWrite   {...props}/>}/>
          <Route path="/board"                render={(props) => <Board        {...props}/>}/>
          <Route path="/"                     render={(props) => <Redirect to="/board" />}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;