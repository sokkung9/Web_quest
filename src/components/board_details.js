import React from 'react';
import API from '../api/api';
import { Link } from "react-router-dom";

class BoardDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isEditingMode: false,

      editTitle: '',
      editContent: '',

      postDetails: [],
      comments: [],
    };

    this.defaultPageForComments = 0;

    this._handleInputChange = this._handleInputChange.bind(this);
    this._toggleForEditing = this._toggleForEditing.bind(this);
    this._editPost = this._editPost.bind(this);
    this._cancleEditPost = this._cancleEditPost.bind(this);
    this._deletePost = this._deletePost.bind(this);
    this._likeComment = this._likeComment.bind(this);
  }

  componentDidMount() {
    this._asyncWorks();
  }
  
  async _asyncWorks() {
    this.setState({ isLoading: true });
    let postIdx = this.props.match.params.postIdx;
    let page = this.defaultPageForComments;

    let [ postDetails, comments] = await Promise.all([
      this._getPostDetails(postIdx),
      this._getComments(postIdx, page),
    ]);
    this.setState({
      isLoading: false,
      postDetails: postDetails || [],
      editTitle: postDetails.title || '',
      editContent: postDetails.content || '',
      comments: comments || [],
    });
  }

  _readPostDetails(postIdx) {
    let pathname = '/community/post';
    if (postIdx)
      pathname += `/${postIdx}`;

    return { pathname };
  }

  async _getPostDetails(postIdx) {
    if (!postIdx)
      return;

    try {
      let req = this._readPostDetails(postIdx);
      const postDetails = await API.db.get(req.pathname, { withCredentials: true }).then(res => (res.data.data || []));
      return postDetails;
    } catch (e) {
      console.debug('BoardDetails._getPostDetails()', e);
      return [];
    }
  }

  _readComments(postIdx, page) {
    let pathname = '/comment/post';
    if (postIdx)
      pathname += `/${postIdx}`;
    if (page !== void 0)
      pathname += `/${page}`;

    return { pathname };
  }

  async _getComments(postIdx, page) {
    if (!postIdx || page === void 0)
      return;
    try {
      let req = this._readComments(postIdx, page);
      const comments = await API.db.get(req.pathname, { withCredentials: true }).then(res => (res.data.data.data || []));
      return comments;
    } catch (e) {
      console.debug('BoardDetails._getComments()', e)
    }
  }

  _handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({ [name]: value });
  }

  _toggleForEditing() {
    this.setState({ isEditingMode: !this.state.isEditingMode });
  }
  
  async _editPost(e) {
    if (!this.state.editContent.trim() || !this.state.editTitle.trim()) {
      this._toggleForEditing();
      return;
    }

    const isSucceed = await Promise.all([
      this._updatePost(),
    ]);
    if (isSucceed[0].success) {
      window.location.reload();
      alert('글이 수정되었습니다.');
      this._toggleForEditing();
    }
  }

  _updatePost() {
    let postIdx = this.state.postDetails.postIdx;
    let editTitle = this.state.editTitle;
    let editContent = this.state.editContent;
    if (!postIdx || !editTitle.trim() || !editContent.trim())
      return;
    
    try {
      let req = {
        pathname: `/community/post/${postIdx}`,
        params: {
          "title": editTitle,
          "content": editContent,
        }
      };
      let result = API.db.put( req.pathname, {
        ...req.params,
        withCredentials: true,
      }).then(res => res.data || []);
      return result;
    } catch (e) {
      console.debug('BoardDetails._updatePost()', e);
    }
  }

  _cancleEditPost() {
    this.setState({
      isEditingMode: false,
      editContent: this.props.content,
    });
  }

  _deletePost() {
    let postIdx = this.state.postDetails.postIdx;
    if (!postIdx)
      return;

    try {
      let req = { pathname: `/community/post/${postIdx}` };
      let result = API.db.delete( req.pathname, {
        withCredentials: true,
      }).then(res => res.data || []);
      if (result.success)
        alert('글을 삭제하였습니다.');
      else
        alert('글 삭제에 실패했습니다.');
      this.props.history.push({pathname: '/board'});

    } catch (e) {
      console.debug('BoardDetails._deletePost()', e);
    }
  }

  _createLikeComment(commentIdx) {
    let postIdx = this.state.postDetails.postIdx;
    let pathname = '/community/postLike';
    let params = {
      "postIdx": postIdx,
      "commentIdx": commentIdx,
    }
      
    return { pathname, params };
  }


  _likeComment(e) {
    let commentIdx = Number(e.target.value);
    try {
      let req = this._createLikeComment(commentIdx);
      // x-www-form-urlencoded 형식으로 request body 변환 필요
      const result = API.db.post(req.pathname, {
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

  render() {
    let postDetails = this.state.postDetails;
    let comments = this.state.comments;
    let isEditingMode = this.state.isEditingMode;
    
    return (
      <React.Fragment>
        <div className="d-flex flex-column">
          <div className="m-3 fw-bold">글 상세보기</div>
          <Link to={{pathname: '/board'}}>
            <button className="btn btn-light border-dark m-3">목록</button>
          </Link>
        </div>
        {this.state.isLoading
          ? 
            <div className="m-3">로딩 중입니다.</div>
          : 
            <div className="flex-column mx-3">
              {postDetails
                ? (!isEditingMode)
                  ? (
                    <div>
                      <div className="flex-column jusfity-content-center">
                        <div className="d-flex border bg-light">
                          <div className="mx-3 flex-shrink-0 text-center" style={{width: "70px"}}>{postDetails.postIdx}</div>
                          <div className="mx-3 flex-fill text-start">{postDetails.title}</div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between bg-light">
                        <div className="d-flex border">
                          <div className="mx-3 flex-shrink-0 text-center" style={{width: "70px"}}>{postDetails.nickname}</div>
                          <div className="ms-3 flex-shrink-0" style={{width: "180px"}}>{postDetails.createdAt}</div>
                        </div>
                        <div className="d-flex border">
                          <div className="mx-3 flex-shrink-0" style={{width: "70px"}}>좋아요 수</div>
                          <div className="flex-shrink-0" style={{width: "50px"}}>{postDetails.likeCount}</div>
                        </div>
                      </div>
                      <div className="d-flex border">
                        <div className="m-3 flex-fill" style={{wordBreak: "break-all"}}>{postDetails.content}</div>
                      </div>
                      <div className="mt-3 d-flex justify-content-end">
                        <button className="me-1 btn btn-light border-dark" onClick={this._toggleForEditing}>수정</button>
                        <button className="me-2 btn btn-light border-dark" onClick={this._deletePost}>삭제</button>
                      </div>
                    </div>
                  ) :
                  (
                    <div>
                      <div className="flex-column jusfity-content-center">
                        <div className="d-flex border bg-light">
                          <div className="mx-3 flex-shrink-0 text-center" style={{width: "70px"}}>{postDetails.postIdx}</div>
                          <div className="mx-3 flex-fill text-start">
                            <input type="textarea" name="editTitle"
                              value={this.state.editTitle} className="ms-2" style={{width: "350px"}}
                              onChange={this._handleInputChange}
                            >
                            </input>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between bg-light">
                        <div className="d-flex border">
                          <div className="mx-3 flex-shrink-0 text-center" style={{width: "70px"}}>{postDetails.nickname}</div>
                          <div className="ms-3 flex-shrink-0" style={{width: "180px"}}>{postDetails.createdAt}</div>
                        </div>
                        <div className="d-flex border">
                          <div className="mx-3 flex-shrink-0" style={{width: "70px"}}>좋아요 수</div>
                          <div className="flex-shrink-0" style={{width: "50px"}}>{postDetails.likeCount}</div>
                        </div>
                      </div>
                      <div className="d-flex border">
                        <div className="m-3 flex-fill" style={{wordBreak: "break-all"}}>
                          <textarea name="editContent" value={this.state.editContent}
                            onChange={this._handleInputChange}
                            rows={15} cols={60} className="ms-2"
                          >
                            {postDetails.content}
                          </textarea>
                        </div>
                      </div>
                      <div className="mt-3 d-flex justify-content-end">
                        <button className="me-1 btn btn-light border-dark" onClick={this._editPost}>수정 완료</button>
                        <button className="me-2 btn btn-light border-dark" onClick={this._cancleEditPost}>취소</button>
                      </div>
                    </div>
                  )
                : <div className="m-4 text-center">게시글이 없습니다.</div>
              }
              <div>
                <div className="fw-bold">전체 댓글 {comments.length}개</div>
                  {comments.length
                    ?
                      ( comments.map((c, i) => {
                        return(
                          <div key={c.commentIdx} className="d-flex border">
                            <div className="border" style={{width: "100px"}}>{c.nickname}</div>
                            <div className="flex-fill">{c.content}</div>
                            <div className="border" style={{width: "100px"}}>좋아요 {c.likeCount}</div>
                            <button className="btn btn-light" onClick={this._likeComment} value={c.commentIdx}>좋아요</button>
                          </div>
                        );
                        })
                      )
                    :
                      null
                  }
                </div>
            </div>
        }
      </React.Fragment>
    );
  }

}

export default BoardDetails;