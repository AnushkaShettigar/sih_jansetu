import { useNavigate } from 'react-router-dom'
import { Bell, LockKeyhole, LogOut, UserRound } from 'lucide-react'
import { clearDemoAuth, getDemoUser } from '../auth'

function Settings() {
	const navigate = useNavigate()
	const user = getDemoUser()

	return <main className="settings-page">
		<header><a href="/" className="nav-brand">JanSetu</a><a href="/" className="settings-back">Back to home</a></header>
		<section className="settings-shell">
			<span className="complaint-kicker">Account preferences</span>
			<h1>Settings</h1>
			<p>Manage your JanSetu account and notification preferences.</p>
			<section className="settings-card">
				<div className="settings-row"><UserRound size={19} /><div><h2>Account information</h2><p>Signed in as <strong>{user?.role || 'Citizen'}</strong>{user?.department ? ` · ${user.department} Department` : ''}</p></div></div>
				<div className="settings-row"><Bell size={19} /><div><h2>Notification preferences</h2><p>Receive updates about complaint progress and civic service activity.</p></div><label className="settings-toggle"><input type="checkbox" defaultChecked /><span /></label></div>
				<div className="settings-row"><LockKeyhole size={19} /><div><h2>Privacy and preferences</h2><p>Your demo account details remain in this browser session only.</p></div></div>
				<button className="settings-logout" onClick={() => { clearDemoAuth(); navigate('/login') }}><LogOut size={16} /> Logout</button>
			</section>
		</section>
	</main>
}
export default Settings
