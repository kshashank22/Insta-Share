import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import InstaPostRoute from '../InstaPostRoute'
import InstaStory from '../InstaStory'

import SearchPostCard from '../SearchPostCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'IN_PROCESS',
}

class Home extends Component {
  state = {
    userSearchResults: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
  }

  componentDidMount() {
    this.getSearchResults()
  }

  getSearchResults = async () => {
    this.setState({apiStatus: apiStatusConstants.inProcess})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = fetchedData.posts.map(eachItem => ({
        caption: eachItem.post_details.caption,
        imageUrl: eachItem.post_details.image_url,
        postId: eachItem.post_id,
        profilePicture: eachItem.profile_pic,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
        createdAt: eachItem.created_at,
        likesCount: eachItem.likes_count,
        userComments: eachItem.comments,
      }))

      console.log(updatedData)
      this.setState({
        userSearchResults: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickSearch = () => {
    this.getSearchResults()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  onEnterSearchInput = () => {
    this.getSearchResults()
  }

  renderSearchPostCardResultView = () => {
    const {userSearchResults, searchInput} = this.state
    const shouldShowPostList = userSearchResults.length > 0
    console.log(searchInput)

    return shouldShowPostList ? (
      <>
        <div className="search-result-container">
          <div className="search-content">
            <h1 className="search-result-heading">Search Results</h1>
          </div>
        </div>
        <ul className="list-item-container">
          {userSearchResults.map(eachPost => (
            <SearchPostCard key={eachPost.postId} userPostDetails={eachPost} />
          ))}
        </ul>
      </>
    ) : (
      <div className="no-post-view-container">
        <img
          src="https://res.cloudinary.com/dahw90b2z/image/upload/v1649202381/Group_1_jhn8xw.png"
          className="no-image"
          alt="search not Found"
        />
        <h1 className="no-heading">Search Not Found</h1>
        <p className="no-description">Try different keyword or search again</p>
      </div>
    )
  }

  onClickRetry = () => {
    this.getSearchResults()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://res.cloudinary.com/dahw90b2z/image/upload/v1649208425/Icon_1_qfbohw.png"
        alt="failure view"
      />
      <p className="not-found-heading">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="home-page-btn"
        onClick={this.onClickRetry}
      >
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="Oval" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllSearchPost = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchPostCardResultView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProcess:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    console.log(searchInput)
    return (
      <div className="nav-bg-light">
        <Header
          searchInput={searchInput}
          onClickSearch={this.onClickSearch}
          changeSearchInput={this.changeSearchInput}
          onEnterSearchInput={this.onEnterSearchInput}
        />

        {searchInput !== '' ? (
          <>{this.renderAllSearchPost()}</>
        ) : (
          <>
            <InstaStory />
            <InstaPostRoute />
          </>
        )}
      </div>
    )
  }
}

export default Home
