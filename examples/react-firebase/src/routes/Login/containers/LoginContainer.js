import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import GoogleButton from 'react-google-button'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import LoginForm from '../components/LoginForm/LoginForm'
import { LIST_PATH } from 'constants/paths'
import firebaseUtil from '../../../utils/firebase'

// styles
import classes from './LoginContainer.scss'

export default class Login extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  state = {
    snackCanOpen: false,
    isLoading: false
  }

  handleLogin = loginData => {
    this.setState({
      snackCanOpen: true,
      isLoading: true
    })

    const { email, password } = loginData
    if (email && password) {
      firebaseUtil.auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) => {
          if (error) {
            console.error('Error logging in:', error)
            newState.errorMessage = error.message || 'Error with login'
          } else {
            console.log('time to redirect or login?', error)
          }
          this.setState({ isLoading: false })
        })
    }
    
  }

  providerLogin = (provider) =>
    this.handleLogin({ provider, type: 'popup' })

  render () {
    const { snackCanOpen, isLoading, errorMessage } = this.state
    if (isLoading) {
      return (
        <div className={classes['container']}>
          <div className={classes['progress']}>
            <CircularProgress mode='indeterminate' />
          </div>
        </div>
      )
    }

    return (
      <div className={classes['container']}>
        <Paper className={classes['panel']}>
          <LoginForm onSubmit={this.handleLogin} />
        </Paper>
        <div className={classes['or']}>
          or
        </div>
        <div className={classes['providers']}>
          <GoogleButton onClick={() => this.providerLogin('google')} />
        </div>
        <div className={classes['signup']}>
          <span className={classes['signup-label']}>
            Need an account?
          </span>
          <Link className={classes['signup-link']} to='/signup'>
            Sign Up
          </Link>
        </div>
        {
          snackCanOpen && typeof errorMessage !== null &&
            <Snackbar
              open={snackCanOpen && typeof errorMessage !== 'null'}
              message={errorMessage}
              action='close'
              autoHideDuration={3000}
              onRequestClose={this.handleRequestClose}
            />
        }

      </div>
    )
  }
}
