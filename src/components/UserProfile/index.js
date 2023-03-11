import {Component} from 'react'

import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserProfile extends Component {
  state = {
    userProfile: {},
    posts: [],
    stories: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserProfile()
  }

  getsPosts = data => ({
    id: data.id,
    image: data.image,
  })

  getStories = data => ({
    id: data.id,
    image: data.image,
  })

  getUserProfile = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {userId} = params
    console.log(userId)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/users/${userId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const fetchedData = data.user_details
      const userProfileData = {
        followersCount: fetchedData.followers_count,
        followingCount: fetchedData.following_count,
        id: fetchedData.id,
        postsCount: fetchedData.posts_count,
        profilePic: fetchedData.profile_pic,
        userBio: fetchedData.user_bio,
        userId: fetchedData.user_id,
        userName: fetchedData.user_name,
      }
      const posts = fetchedData.posts.map(each => this.getsPosts(each))
      const stories = fetchedData.stories.map(each => this.getStories(each))
      this.setState({
        userProfile: userProfileData,
        posts,
        stories,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  getUserProfileSuccess = () => {
    const {userProfile, posts, stories} = this.state
    const {
      userName,
      profilePic,
      postsCount,
      followersCount,
      followingCount,
      userId,
      userBio,
    } = userProfile
    const showPosts = posts.length > 0
    return (
      <div className="my-profile-main-container">
        <div className="container">
          <div className="my-profile-container">
            <div className="image-container">
              <img
                src={profilePic}
                alt="user profile"
                className="my-profile-pic"
              />
            </div>
            <div className="my-profile">
              <div className="user-name-card">
                <h1 className="user-name"> {userName} </h1>
              </div>
              <div className="my-profile-followers-container">
                <div className="cards">
                  <p className="counts">{postsCount}</p>
                  <p> posts </p>
                </div>
                <div className="cards">
                  <p className="counts">{followersCount}</p>
                  <p>followers </p>
                </div>
                <div className="cards">
                  <p className="counts">{followingCount}</p>
                  <p> following</p>
                </div>
              </div>
              <div>
                <p className="user-id"> {userId} </p>
              </div>
              <div>
                <p className="user-bio"> {userBio} </p>
              </div>
            </div>
          </div>
          <div>
            <ul className="stories-list">
              {stories.map(eachStory => (
                <li key={eachStory.id} className="story-item">
                  <img
                    className="stories-image"
                    src={eachStory.image}
                    alt="user story"
                  />
                </li>
              ))}
            </ul>
          </div>

          <hr className="line" />

          <div>
            <div className="my-posts">
              <BsGrid3X3 />
              <h1 className="heading">Posts</h1>
            </div>

            {showPosts ? (
              <ul className="posts-list">
                {posts.map(eachPost => (
                  <li className="all-post-img" key={eachPost.id}>
                    <img
                      className="posts-image"
                      src={eachPost.image}
                      alt="user post"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-posts-yet">
                <div className="no-posts-card">
                  <BiCamera className="no-posts-logo" />
                  <h1 className="no-post-heading"> No Posts Yet</h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  getUserProfileLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onClickTryButton = () => {
    this.getMyProfile()
  }

  getUserProfileFailure = () => (
    <div className="failure-views">
      <img
        alt="failure view"
        src="https://res.cloudinary.com/dfqkajd1a/image/upload/v1673234871/Group_7522_yxgexf.png"
        className="failure-view-image"
      />
      <p className="failure-msg"> Something went wrong. Please try again </p>
      <button
        type="button"
        className="try-button"
        onClick={this.onClickTryButton}
      >
        Try again
      </button>
    </div>
  )

  renderUserProfileDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getUserProfileSuccess()
      case apiStatusConstants.inProgress:
        return this.getUserProfileLoaderView()
      case apiStatusConstants.failure:
        return this.getUserProfileFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderUserProfileDetails()}
      </div>
    )
  }
}

export default UserProfile
