import React from 'react';

class Header extends React.Component {

  render() {
    const communities = [
      {
        communityIdx: 1,
        communityName: "자유게시판"
      },
      {
        communityIdx: 2,
        communityName: "정보게시판"
      },
      {
        communityIdx: 3,
        communityName: "맛집게시판"
      },
      {
        communityIdx: 4,
        communityName: "투표게시판"
      },
      {
        communityIdx: 5,
        communityName: "홍보게시판"
      },
      {
        communityIdx: 6,
        communityName: "학과게시판"
      },
    ];
    return (
      <div>
        {communities.map((c, i) => {
          return (
            <button key={i} value={c.communityIdx}
              className="btn btn-info fw-bold mx-1" style={{color: "white"}}
              onClick={this.props._handleChangeCommunityIdx}
            >
              {c.communityName}
            </button>
          );
        })}
      </div>
    );
  }
}

export default Header;