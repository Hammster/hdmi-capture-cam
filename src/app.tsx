import React, { useState } from 'react'
import styles from './app.module.css'
import Screen from './components/screen'
import Controls from './components/controls'

function App() {
	const [count, setCount] = useState(0)

	return (
		<div className={styles.app}>
			<main className={styles.displaySection}>
				<Screen/>
			</main>
			<nav className={styles.controlSection}>
				<Controls />
			</nav>
		</div>
	)
}

export default App
