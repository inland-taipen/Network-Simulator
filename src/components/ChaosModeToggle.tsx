import { useState, useEffect } from 'react'
import { setChaosMode } from '../mocks/handlers'
import './ChaosModeToggle.css'

export function ChaosModeToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setChaosMode(enabled)
  }, [enabled])

  return (
    <div className={`chaos-toggle ${enabled ? 'active' : ''}`}>
      <label className="chaos-label">
        <div className="chaos-text-wrapper">
          <span className="chaos-text">
            <span className="chaos-icon">{enabled ? '⚡' : '🔌'}</span>
            <span>Chaos Mode</span>
          </span>
          {enabled && (
            <span className="chaos-badge">Active</span>
          )}
        </div>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="chaos-checkbox"
        />
        <span className="chaos-slider">
          <span className="chaos-slider-thumb"></span>
        </span>
      </label>
      {enabled && (
        <div className="chaos-warning">
          <div className="chaos-warning-item">
            <span className="chaos-warning-icon">⏱️</span>
            <span>Random latency (0-5s)</span>
          </div>
          <div className="chaos-warning-item">
            <span className="chaos-warning-icon">⚠️</span>
            <span>10% error rate</span>
          </div>
        </div>
      )}
    </div>
  )
}