import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showErrorMsg: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      errorMsg,
      showErrorMsg: true,
    })
  }

  onLoginSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    console.log(response)
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else if (response.status === 400) {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUserInput = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  renderLoginUsername = () => {
    const {username} = this.state
    return (
      <div className="username-input-label-container">
        <label htmlFor="username" className="username-label">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input"
          placeholder="USERNAME"
          value={username}
          onChange={this.onChangeUserInput}
        />
      </div>
    )
  }

  renderLoginPassword = () => {
    const {password} = this.state
    return (
      <div className="password-input-label-container">
        <label htmlFor="password" className="password-label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input"
          placeholder="PASSWORD"
          value={password}
          onChange={this.onChangePassword}
        />
      </div>
    )
  }

  render() {
    const {errorMsg, showErrorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-main-container">
        <div>
          <img
            src="https://res.cloudinary.com/dfqkajd1a/image/upload/v1672733227/Layer_2_1x_srnok2.png"
            alt="website login"
            className="website-logo-large"
          />
        </div>

        <div className="login-form-container">
          <div className="website-image-container">
            <img
              src="https://res.cloudinary.com/dfqkajd1a/image/upload/v1672733292/Standard_Collection_8_hkeehs.png"
              alt="website logo"
              className="website-logo"
            />
            <h1 className="website-name">Insta Share</h1>
          </div>
          <form onSubmit={this.onLoginSubmitForm}>
            {this.renderLoginUsername()}

            {this.renderLoginPassword()}

            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg && <p className="errorMsg"> {errorMsg} </p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginPage
