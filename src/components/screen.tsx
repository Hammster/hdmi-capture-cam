import React, { useState } from 'react'
import { useAppSettingsStore } from '../state/settings'
import styles from './screen.module.css'

function Screen() {
  const appSettings = useAppSettingsStore(state => state)

	return (
    <div className={styles.screen}>
      <div className={styles.display}>
        <video width={appSettings.resolutionW} height={appSettings.resolutionH}></video>

        
      </div>
    </div>
  )
}

/**
        <div className={styles.stats}>
          <ul>
            <li>Video Source ID: {appSettings.videoSourceId || 'None'}</li>
            <li>Audio Source ID: {appSettings.audioSourceId || 'None'}</li>
            <li>Resolution: {appSettings.resolutionW} x {appSettings.resolutionH}</li>
          </ul>
        </div>
 */

export default Screen
