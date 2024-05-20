import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    se: false,
    em: '',
  }

  one = event => {
    this.setState({userId: event.target.value})
  }

  two = event => {
    this.setState({pin: event.target.value})
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  fail = em => {
    this.setState({se: true, em})
  }

  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const url = 'ttps://apis.ccbp.in/ebank/login'
    const userDet = {user_id: userId, pin}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDet),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.success(data.jwt_token)
    } else {
      this.fail(data.error_msg)
    }
  }

  render() {
    const {userId, pin, se, em} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
          />
        </div>
        <form onSubmit={this.BankLogin}>
          <h1>Welcome Back!</h1>
          <div>
            <label htmlFor="user">User ID</label>
            <input
              id="user"
              value={userId}
              onChange={this.one}
              placeholder="Enter User ID"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="pin">PIN</label>
            <input
              id="pin"
              value={pin}
              onChange={this.two}
              type="password"
              placeholder="Enter Pin"
            />
          </div>
          <button type="submit">Login</button>
          <div>{se === true && <p>{em}</p>}</div>
        </form>
      </div>
    )
  }
}
export default Login
