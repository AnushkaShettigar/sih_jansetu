import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DemoDigiLocker from './components/DemoDigiLocker'
import { setDemoAuth } from './auth'

function Login() {
	const navigate = useNavigate()
	const [credentials, setCredentials] = useState({ username: '', password: '' })
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const [notice, setNotice] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)
	const [showDigiLocker, setShowDigiLocker] = useState(false)

	function handleChange(event) {
		setCredentials({ ...credentials, [event.target.name]: event.target.value })
		setError('')
	}

	function handleSubmit(event) {
		event.preventDefault()
		if (isProcessing) return
		const { username, password } = credentials
		if (!username.trim() || !password) {
			setError('Enter your username and password to continue.')
			return
		}
		setIsProcessing(true)
		setError('')
		setTimeout(() => {
			if (username === 'admin' && password === 'admin123') { setDemoAuth('admin'); return navigate('/admin') }
			if (username === 'Anushka_Shettigar' && password === 'citizen123') { setDemoAuth('citizen'); return navigate('/') }
			setError('Incorrect username or password. Please try again.')
			setIsProcessing(false)
		}, 450)
	}

	return <main className="login-page">
		<div className="login-overlay" aria-hidden="true" />
		<a className="nav-brand login-nav-brand" href="/" aria-label="JanSetu home">JanSetu</a>
		<section className="login-card" aria-labelledby="login-title">
			<span className="login-kicker">Digital civic governance</span>
			<h1 id="login-title">Login</h1>
			<p className="login-intro">Access your JanSetu account and stay connected to civic action.</p>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username</label>
				<div className="login-input-wrap"><UserRound size={17} /><input id="username" name="username" value={credentials.username} onChange={handleChange} autoComplete="username" placeholder="Enter your username" required /></div>
				<label htmlFor="password">Password</label>
				<div className="login-input-wrap"><LockKeyhole size={17} /><input id="password" name="password" value={credentials.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
				<div className="login-options"><label><input type="checkbox" /> <span>Remember me</span></label><button type="button" onClick={() => setNotice('Password recovery will be available soon.')}>Forgot password?</button></div>
				<button className="login-button" type="submit" disabled={isProcessing} aria-busy={isProcessing}>{isProcessing ? 'Checking...' : 'Login'} {!isProcessing && <ArrowRight size={16} />}</button>
				{error && <p className="login-error" role="alert">{error}</p>}
				{notice && <p className="login-notice" role="status">{notice}</p>}
			</form>
			<div className="login-divider"><span>OR</span></div>
			<button className="digilocker-button" type="button" onClick={() => { setNotice(''); setShowDigiLocker(true) }}>Continue with DigiLocker</button>
			<p className="login-register">Don't have an account? <button type="button" onClick={() => setNotice('Registration will be available soon.')}>Register</button></p>
		</section>
		<p className="login-footnote">Public service, made simpler.</p>
		{showDigiLocker && <DemoDigiLocker onCancel={() => setShowDigiLocker(false)} onVerified={() => { setDemoAuth('citizen'); navigate('/') }} />}
	</main>
}

export default Login
