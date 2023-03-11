import {Component} from 'react'
import {BsHeart} from 'react-icons/bs'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'
import './index.css'

class SearchPostCard extends Component {
  state = {
    isLiked: true,
    likedStatus: false,
    counter: 0,
  }

  renderPostLikeStatus = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {userPostDetails} = this.props
    const {postId} = userPostDetails

    const {likedStatus} = this.state
    console.log(likedStatus)

    const requestedBody = {
      like_status: likedStatus,
    }

    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(requestedBody),
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedPostId = await response.json()
      console.log(fetchedPostId)
    }
  }

  onDisLikeButton = () => {
    this.setState({
      isLiked: false,
    })
    this.setState(prevState => ({
      counter: prevState.counter + 1,
    }))
    this.setState(
      {
        likedStatus: false,
      },
      this.getPostDetails,
    )
  }

  onLikeButton = () => {
    this.setState({
      isLiked: true,
    })
    this.setState(prevState => ({
      counter: prevState.counter - 1,
    }))
    this.setState(
      {
        likedStatus: true,
      },
      this.getPostDetails,
    )
  }

  render() {
    const {userPostDetails} = this.props
    const {
      profilePicture,
      userId,
      userName,
      createdAt,
      likesCount,
      userComments,

      imageUrl,
      caption,
    } = userPostDetails

    const {isLiked} = this.state

    const {counter} = this.state
    const updateCount = likesCount + counter

    return (
      <li className="feeds-list">
        <div className="profile-pic-container">
          <img
            src={profilePicture}
            alt="post author profile"
            className="profile-pic"
          />
          <Link to={`/users/${userId}`} className="user-profile-link">
            <h1 className="profile-pic-username">{userName}</h1>
          </Link>
        </div>
        <div>
          <img src={imageUrl} alt="post" className="feeds-post-image" />
        </div>
        <div className="like-share-container">
          {isLiked ? (
            <button
              type="button"
              className="like-button"
              testid="likeIcon"
              onClick={this.onDisLikeButton}
            >
              <BsHeart testid="likeIcon" />
            </button>
          ) : (
            <button
              type="button"
              className="like-button"
              testid="unLikeIcon"
              onClick={this.onLikeButton}
            >
              <FcLike testid="unLikeIcon" />
            </button>
          )}
          <button type="button" className="like-button">
            <FaRegComment />
          </button>
          <button type="button" className="like-button">
            <BiShareAlt />
          </button>
        </div>
        <div className="like-share-container">
          <p className="likes-count"> {updateCount} likes </p>
          <p className="captions"> {caption} </p>
          <ul className="comments-list">
            {userComments.map(each => (
              <li key={each.user_id}>
                <p className="comment">
                  <span className="comment-name"> {each.user_name} </span>
                  {each.comment}
                </p>
              </li>
            ))}
          </ul>
          <p className="created"> {createdAt} </p>
        </div>
      </li>
    )
  }
}

export default SearchPostCard
