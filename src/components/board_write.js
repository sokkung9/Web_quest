import React from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

class BoardWrite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      title: '',
      content: '',
    }
    
    this._submit = this._submit.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
  }

  async _submit() {
    let result = await this._validate();
    if (!result)
      return;
    try {
      const result = await Promise.all([
        this._postPost(),
      ]);
      if (result)
        alert("글이 등록되었습니다.");
      else
        alert("글 등록에 실패했습니다.");
      this.props.history.push({pathname: '/board'});
    } catch (e) {
      console.debug('Board._submit()', e);
      return [];
    }
  }

  async _validate() {
    const { title, content } = this.state;
    if (!title.trim().length) {
      alert("제목을 입력해 주세요.");
      return;
    }
    if (!content.trim().length) {
      alert("내용을 입력해 주세요.");
      return;
    }
    return true;
  }

  _createPost(communityIdx) {
    let { title, content } = this.state;
    let pathname = '/community/post';
    let params = {
      "title": title,
      "content": content,
    }
    if (communityIdx)
      pathname += `/${communityIdx}`;
      
    return { pathname, params };
  }

  async _postPost() {
    const communityIdx = this.props.location.state.communityIdx;
    try {
      let req = this._createPost(communityIdx);
      const result = await API.db.post(req.pathname, {
        ...req.params,
        withCredentials: true,
      }).then(res => res.data || []);
      if (result.success)
        return true;
      else
        return false;
    } catch (e) {
      console.debug('Board._postPost()', e);
      return [];
    }
  }

  async _handleChangePage(e) {
    let allPost = await Promise.all([
      this._getAllPost(e.target.value),
    ]);
    if (allPost)
      this.setState({ allPost: allPost[0] || [] });
  }

  _handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({ [name]: value });
  }

  render() {
    return (
      <React.Fragment>
        <div className="m-3">
          <div className="mb-3 fw-bold">글 작성하기</div>
          <div className="d-flex">
            <div>제목</div>
            <div>
              <input type="text" name="title" value={this.state.title}
                className="ms-2" style={{width: "350px"}}
                onChange={this._handleInputChange}
              >
              </input>
            </div>
          </div>
          <div className="d-flex mt-2">
            <div>내용</div>
            <div>
              <textarea name="content" value={this.state.content}
                rows={15} cols={60} className="ms-2"
                onChange={this._handleInputChange}
              >
              </textarea>
            </div>
          </div>
          <div className="d-flex">
            <button className="me-2 btn btn-light border-dark" onClick={this._submit}>저장</button>
            <Link to={{pathname: '/board'}}>
              <button className="btn btn-light border-dark">목록</button>
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  }

}

export default BoardWrite;