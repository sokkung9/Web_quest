import React from 'react';
import Header from './header';
import VBoard from './v_board';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      communityIdx: 1,
      communityName: '자유게시판',
    };

    this._handleChangeCommunityIdx = this._handleChangeCommunityIdx.bind(this);
    
  }

  _handleChangeCommunityIdx(e) {
    let communityIdx = e.target.value;
    let communityName = e.target.innerText;
    this.setState({ communityIdx, communityName });
  }

  render() {
    return (
      <div className="m-3">
        <div className="m-3 fw-bold">포켓유니브 게시판</div>
        <Header _handleChangeCommunityIdx={this._handleChangeCommunityIdx}/>
        <VBoard communityIdx={this.state.communityIdx} communityName={this.state.communityName}/>
      </div>
    );
  }
}

export default Board;