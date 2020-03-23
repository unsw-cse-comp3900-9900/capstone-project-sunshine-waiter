import React, { useState } from 'react'

import './default.css'
import GoogleAuth from './GoogleAuth'
import BaseProvider from '../apis/BaseProvider'

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

  BaseProvider.post(URL, param)
    .then(res => {
      console.log(res)
      onAuthenticated(true)
    })
    .catch(res => console.log(res.message))
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
