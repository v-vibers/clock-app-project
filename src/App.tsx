import React from 'react'
import { useSubscribeDev } from '@subscribe.dev/react'
import './App.css'

function SignInScreen({ signIn }: { signIn: () => void }) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="clock-title">🕐 Clock App</h1>
        <p className="auth-message">Sign in to access your personalized clock with cloud-synced preferences</p>
        <button onClick={signIn} className="sign-in-button">
          Sign In
        </button>
      </div>
    </div>
  )
}

function ClockApp() {
  const { useStorage, signOut, user, usage, subscriptionStatus, subscribe } = useSubscribeDev()

  const [clockData, setClockData] = useStorage('clock-data', {
    timezone: 'UTC',
    format24h: true,
    lastViewedAt: Date.now()
  })

  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    setClockData({
      ...clockData,
      lastViewedAt: Date.now()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleFormat = () => {
    setClockData({
      ...clockData,
      format24h: !clockData.format24h
    })
  }

  const formatTime = (date: Date) => {
    if (clockData.format24h) {
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } else {
      return date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const lastViewed = clockData.lastViewedAt
    ? new Date(clockData.lastViewedAt).toLocaleString()
    : 'Never'

  return (
    <div className="clock-container">
      <header className="clock-header">
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <button onClick={signOut} className="sign-out-button">
            Sign Out
          </button>
        </div>
        <div className="subscription-info">
          <span className="credits">Credits: {usage?.remainingCredits ?? 0}</span>
          <span className="plan">{subscriptionStatus?.plan?.name ?? 'Free'}</span>
          {subscribe && (
            <button onClick={subscribe} className="manage-subscription-button">
              Manage
            </button>
          )}
        </div>
      </header>

      <main className="clock-main">
        <div className="clock-display">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>
        </div>

        <div className="clock-controls">
          <button onClick={toggleFormat} className="format-toggle">
            Switch to {clockData.format24h ? '12-hour' : '24-hour'} format
          </button>
        </div>

        <div className="clock-meta">
          <p className="last-viewed">Last viewed: {lastViewed}</p>
        </div>
      </main>
    </div>
  )
}

function App() {
  const { isSignedIn, signIn } = useSubscribeDev()

  if (!isSignedIn) {
    return <SignInScreen signIn={signIn} />
  }

  return <ClockApp />
}

export default App
