import { useEffect, useState } from 'react'
import { ArrowLeft, Check, ShieldCheck, Smartphone, X } from 'lucide-react'

function DemoDigiLocker({ onCancel, onVerified }) {
  const [step, setStep] = useState('mobile')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (step !== 'success') return undefined
    const redirectTimer = setTimeout(onVerified, 1100)
    return () => clearTimeout(redirectTimer)
  }, [onVerified, step])

  function handleMobileSubmit(event) {
    event.preventDefault()
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    setError('')
    setStep('otp')
  }

  function handleOtpSubmit(event) {
    event.preventDefault()
    if (otp !== '123456') {
      setError('Invalid demo OTP. Please use 123456.')
      return
    }
    setError('')
    setStep('success')
  }

  function handleBack() {
    setError('')
    setStep('mobile')
    setOtp('')
  }

  return <div className="demo-auth-backdrop" role="presentation">
    <section className="demo-auth-panel" role="dialog" aria-modal="true" aria-labelledby="demo-auth-title">
      <button className="demo-auth-close" type="button" aria-label="Cancel DigiLocker demo" onClick={onCancel}><X size={18} /></button>
      <div className="demo-auth-header"><span className="demo-auth-mark"><ShieldCheck size={18} /></span><div><span className="demo-auth-kicker">DEMO • Hackathon Prototype</span><strong>DigiLocker</strong></div></div>
      {step === 'mobile' && <>
        <h2 id="demo-auth-title">Secure Citizen Identity Verification</h2>
        <p className="demo-auth-copy">This is a demonstration of the DigiLocker authentication flow for the JanSetu prototype.</p>
        <form className="demo-auth-form" onSubmit={handleMobileSubmit}>
          <label htmlFor="demo-mobile">Mobile number</label>
          <div className="demo-auth-input"><Smartphone size={17} /><input id="demo-mobile" inputMode="numeric" autoComplete="tel" maxLength={10} value={mobile} onChange={(event) => { setMobile(event.target.value.replace(/\D/g, '')); setError('') }} placeholder="10-digit mobile number" required /></div>
          {error && <p className="demo-auth-error" role="alert">{error}</p>}
          <button className="demo-auth-primary" type="submit">Continue</button>
        </form>
      </>}
      {step === 'otp' && <>
        <button className="demo-auth-back" type="button" onClick={handleBack}><ArrowLeft size={15} /> Back</button>
        <h2 id="demo-auth-title">Enter demo OTP</h2>
        <p className="demo-auth-copy"><strong>OTP sent</strong><br />A six-digit code was prepared for this prototype.</p>
        <form className="demo-auth-form" onSubmit={handleOtpSubmit}>
          <label htmlFor="demo-otp">One-time password</label>
          <div className="demo-auth-input"><ShieldCheck size={17} /><input id="demo-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '')); setError('') }} placeholder="Enter OTP" required /></div>
          {error && <p className="demo-auth-error" role="alert">{error}</p>}
          <button className="demo-auth-primary" type="submit">Verify</button>
        </form>
      </>}
      {step === 'success' && <div className="demo-auth-success"><span><Check size={25} /></span><h2 id="demo-auth-title">Identity Verified</h2><p>Welcome to JanSetu</p><small>Returning you to the citizen homepage.</small></div>}
      {step !== 'success' && <button className="demo-auth-cancel" type="button" onClick={onCancel}>Cancel</button>}
      <small className="demo-auth-note">No real identity data, SMS, or DigiLocker service is used.</small>
    </section>
  </div>
}

export default DemoDigiLocker
