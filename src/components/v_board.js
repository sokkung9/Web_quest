import React from 'react';
import API from '../api/api';
import { Link } from "react-router-dom";

class VBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      allPost: [],
      lastPage: 1,
    }
    
    this._handleChangePage = this._handleChangePage.bind(this);
  }

  componentDidMount() {
    this._asyncWorks();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.communityIdx !== this.props.communityIdx)) {
      this._asyncWorks();
    }
    // console.log("cdu 호출")
    // console.log("~~~1prevProps===", prevProps);
    // console.log("~~~1prevState===", prevState);
    // console.log("~~~2props===", this.props);
    // console.log("~~~2state===", this.state);
  }
  
  async _asyncWorks() {
    this.setState({ isLoading: true });

    let allPost = await Promise.all([
      this._getAllPost(),
    ]);
    this.setState({
      isLoading: false,
      allPost: allPost[0] || [],
    });
  }

  _readAllPost(communityIdx, page) {
    let pathname = '/community';
    if (communityIdx)
    pathname += `/${communityIdx}`;
    if (page)
      pathname += `/${page}`;
    
    return { pathname };
  }

  async _getAllPost(page) {
    const communityIdx = this.props.communityIdx;
    let defaultPage = this.state.lastPage;

    if (page)
      defaultPage = page;
    try {
      let req = this._readAllPost(communityIdx, defaultPage);
      console.log("req===", req);
      const allPost = await API.db.get(req.pathname, {
        withCredentials: true,
      }).then(res => (res.data.data.data || []));
      return allPost;
    } catch (e) {
      console.debug('VBoard._getAllPost()', e);
      return [];
    }
  }

  async _handleChangePage(e) {
    let lastPage = e.target.value;
    let allPost = await Promise.all([
      this._getAllPost(lastPage),
    ]);
    if (allPost)
      this.setState({ allPost: allPost[0] || [] });
    this.setState({ lastPage });
  }

  render() {
    let allPost = this.state.allPost;
    let lastPage = this.state.lastPage;
    // console.log("render의 allPost===", allPost);
    // console.log("render의 lastPage===", lastPage);
    
    return (
      <React.Fragment>
        <div className="m-3 fw-bold">{this.props.communityName}</div>
        {this.state.isLoading
        ?
          <div>로딩 중입니다.</div>
        : 
          <div>
            <Link to={{pathname: `/board/write`, state: { communityIdx: this.props.communityIdx }}}
              className="position-absolute btn btn-light border-dark text-decoration-none"
              style={{top: 125, right: 30}}
            >
              글쓰기
            </Link>
            <div className="flex-column mt-5 m-3 border">
              <div className="d-flex justify-content-center border bg-light">
                <div className="flex-shrink-0 text-center" style={{width: "70px"}}>번호</div>
                <div className="ms-3 flex-fill text-center">제목</div>
                <div className="ms-3 flex-shrink-0 text-center" style={{width: "100px"}}>작성자</div>
                <div className="ms-3 flex-shrink-0 text-center" style={{width: "175px"}}>작성일</div>
                <div className="ms-3 flex-shrink-0 text-center" style={{width: "70px"}}>좋아요 수</div>
              </div>
              {allPost.length ? 
                allPost.map((p, i) =>
                  <div key={i} className="d-flex jusfity-content-center border">
                    <div className="flex-shrink-0 text-center" style={{width: "70px"}}>{p.postIdx}</div>
                    <Link to={{pathname: `/board/${p.postIdx}`, state: { page: lastPage }}}
                      className="ms-3 flex-fill text-start text-decoration-none text-dark"
                    >
                      <div>{p.title}</div>
                    </Link>
                    <div className="ms-3 flex-shrink-0 text-center" style={{width: "100px"}}>{p.nickname}</div>
                    <div className="ms-3 flex-shrink-0 text-center" style={{width: "175px"}}>{p.createdAt}</div>
                    <div className="ms-3 flex-shrink-0 text-center" style={{width: "70px"}}>{p.likeCount}</div>
                  </div>
                )
                : <div className="text-center m-4">게시글이 없습니다.</div>
              }
            </div>
            <div className="d-flex justify-content-center">
              {
                (() => {
                  const pagenation = [];
                  for(let i = 1; i <= 5; i++) {
                    pagenation.push(<button key={i} className="btn btn-light" onClick={this._handleChangePage} value={i}>{i}</button>);
                  }
                  return pagenation;
                }) ()
              }
            </div>
          </div>
        }
      </React.Fragment>
      
    );
  }

}

export default VBoard;