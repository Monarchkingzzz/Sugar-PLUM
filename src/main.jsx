import React, { Component } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import './App.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Sugar Plum caught runtime error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#12071d',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '28px', color: '#ff385c', marginBottom: '12px' }}>
            Sugar Plum Universe Reconnecting... ✨
          </h2>
          <p style={{ maxWidth: '480px', color: '#e0c9f7', marginBottom: '16px', lineHeight: 1.6 }}>
            The narrator paused for a quick frame refresh. Tap below to reload the romance comic:
          </p>
          {this.state.error && (
            <pre style={{
              background: 'rgba(0,0,0,0.5)',
              color: '#ff8a9e',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              maxWidth: '90vw',
              overflowX: 'auto',
              marginBottom: '20px',
              whiteSpace: 'pre-wrap'
            }}>
              {String(this.state.error?.message || this.state.error)}
              {this.state.error?.stack && '\n' + String(this.state.error.stack).split('\n').slice(0, 4).join('\n')}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              fontSize: '16px',
              fontWeight: 'bold',
              background: '#ff385c',
              color: '#fff',
              border: '2px solid #fff',
              borderRadius: '999px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 56, 92, 0.4)'
            }}
          >
            Reload Website ↻
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </ErrorBoundary>
)
