import React, { useState } from 'react'

import './default.css'
import GoogleAuth from './GoogleAuth'
import BaseProvider from '../apis/BaseProvider'
import { setCookie, getCookie } from './Cookies'

const renderSignUp = (username, setUsername) => {
  return (
    <div className="field">
      <label htmlFor="username">Username</label>
      <div className="ui left icon input">
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <i className="user icon" />
      </div>
      <small>Username has to be as least 5 letters</small>
    </div>
  )
}

const renderGoogleAuth = () => {
  return (
    <div>
      <div className="ui horizontal divider">Or</div>
      <GoogleAuth />
    </div>
  )
}

const onAuth = ([param, onAuthenticated, showSignUp]) => event => {
  event.preventDefault()
  const URL = showSignUp ? '/users' : '/users/login'

  const emailValidator = email => {
    return email.includes('@') && email.includes('.com')
  }

  if (!param.password || !param.email || (showSignUp && !param.name)) {
    alert('Information is incomplete!')
  } else if (showSignUp && param.name.length < 5) {
    alert('Username is less than 5 letters!')
  } else if (!emailValidator(param.email)) {
    alert('Email is invalid!')
  } else if (param.password.length < 10) {
    alert('Password is less than 10 letters!')
  } else {
    BaseProvider.post(URL, param)
      .then(res => {
        const token = showSignUp ? res.data.accessToken : res.data.authToken
        setCookie('token', token)
        getCookie('token') !== undefined && onAuthenticated(true)
      })
      .catch(({ response }) => alert(response.data.error))
  }
}

const AuthCard = ({ onAuthenticated }) => {
  const [showSignUp, setShowSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const signUpParam = {
    name: username,
    email: email,
    password: password,
  }

  const signInParam = {
    email: email,
    password: password,
  }

  const param = showSignUp ? signUpParam : signInParam

  return (
    <div className="auth-card">
      <div className="ui placeholder segment">
        <div className="column">
          <form
            className="ui form"
            onSubmit={onAuth([param, onAuthenticated, showSignUp])}
          >
            <div className="field">
              {showSignUp && renderSignUp(username, setUsername)}
              <label htmlFor="email">Email</label>
              <div className="ui left icon input">
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <i className="envelope icon" />
              </div>
              <small>Email has to be valid</small>
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="ui left icon input">
                <input
                  type="text"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <i className="lock icon" />
              </div>
              <small>Password has to be as least 10 letters</small>
            </div>
            <button
              className="ui blue submit button"
              style={{ width: '210px' }}
            >
              {showSignUp ? 'Sign up' : 'Login'}
            </button>
            {showSignUp ? renderGoogleAuth() : null}
          </form>
        </div>
        {showSignUp || (
          <span
            onClick={() => setShowSignUp(true)}
            style={{
              fontSize: '10px',
              color: 'blue',
              paddingTop: '10px',
              left: '20px',
            }}
          >
            >>register?
          </span>
        )}
      </div>
    </div>
  )
}

export default AuthCard
