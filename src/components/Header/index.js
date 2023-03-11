import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillCloseCircle} from 'react-icons/ai'
import {FaSearch} from 'react-icons/fa'
import Cookies from 'js-cookie'

import './index.css'

class Header extends Component {
  state = {isShowMobileMenu: false, isShowSearch: false}

  onClickHamBergerMenu = () => {
    this.setState(preState => ({isShowMobileMenu: !preState.isShowMobileMenu}))
  }

  onClickCloseButton = () => {
    this.setState({isShowMobileMenu: false})
  }

  onClickSearchTab = () => {
    this.setState(preState => ({isShowSearch: !preState.isShowSearch}))
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickSearchButton = () => {
    const {onClickSearch} = this.props
    onClickSearch()
  }

  onChangeInputSearch = event => {
    const {changeSearchInput} = this.props
    changeSearchInput(event.target.value)
  }

  onKeyChangeEnter = event => {
    const {onEnterSearchInput} = this.props
    if (event.key === 'Enter') {
      onEnterSearchInput()
    }
  }

  renderSearchInput = () => {
    const {searchInput} = this.props
    return (
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          value={searchInput}
          placeholder="Search Caption"
          onChange={this.onChangeInputSearch}
          onKeyDown={this.onKeyChangeEnter}
        />
        <button
          type="button"
          className="search-btn"
          onClick={this.onClickSearchButton}
        >
          <FaSearch className="search-icon" testid="searchIcon" />
        </button>
      </div>
    )
  }

  render() {
    const {isShowMobileMenu, isShowSearch} = this.state
    const {searchInput} = this.props
    return (
      <nav className="navbar-header">
        <div className="navbar-content">
          <div className="navbar-mobile-container">
            <Link to="/" className="nav-link">
              <div className="logo-container">
                <img
                  className="website-logo"
                  src="https://res.cloudinary.com/dahw90b2z/image/upload/v1648981581/Group_qtyxfl.png"
                  alt="website logo"
                />
                <h1 className="nav-header">Insta Share</h1>
              </div>
            </Link>
            <div className="menu-container">
              <button
                type="button"
                onClick={this.onClickHamBergerMenu}
                className="menu-button"
              >
                <GiHamburgerMenu size={15} />
              </button>
            </div>
          </div>
          {isShowMobileMenu && (
            <div>
              <ul className="menu-item-container">
                <li className="nav-menu-item">
                  <Link to="/" className="nav-link">
                    <p className="link-item"> Home</p>
                  </Link>
                </li>
                <li className="nav-menu-item">
                  <button
                    type="button"
                    className="search-button"
                    onClick={this.onClickSearchTab}
                  >
                    Search
                  </button>
                </li>
                <li className="nav-menu-item">
                  <Link to="/my-profile" className="nav-link">
                    <p className="link-item">Profile</p>
                  </Link>
                </li>
                <li className="nav-item-mobile">
                  <button
                    type="button"
                    className="logout-button"
                    onClick={this.onClickLogout}
                  >
                    Logout
                  </button>
                </li>
                <li className="nav-item-mobile">
                  <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={this.onClickCloseButton}
                  >
                    <AiFillCloseCircle className="close-logo" />
                  </button>
                </li>
              </ul>
              <div className="nav-item-mobile">
                {isShowSearch && (
                  <div className="search-input-container">
                    <input
                      type="search"
                      className="search-input"
                      value={searchInput}
                      placeholder="Search Caption"
                      onChange={this.onChangeInputSearch}
                      onKeyDown={this.onKeyChangeEnter}
                    />
                    <button
                      type="button"
                      className="search-btn"
                      onClick={this.onClickSearchButton}
                    >
                      <FaSearch className="search-icon" testid="searchIcon" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="navbar-large-container">
            <Link to="/" className="nav-link">
              <div className="logo-container">
                <img
                  className="website-logo"
                  src="https://res.cloudinary.com/dahw90b2z/image/upload/v1648981581/Group_qtyxfl.png"
                  alt="website logo"
                />
                <h1 className="nav-menu-item">Insta Share</h1>
              </div>
            </Link>
            <ul className="nav-menu">
              <li className="nav-menu-item">{this.renderSearchInput()}</li>

              <li className="nav-menu-item">
                <Link to="/" className="nav-link">
                  <p className="link-text">Home</p>
                </Link>
              </li>

              <li className="nav-menu-item">
                <Link to="/my-profile" className="nav-link">
                  <p className="link-text">Profile</p>
                </Link>
              </li>
            </ul>
            <button
              type="button"
              className="logout-desktop-btn"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
