exports.otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="color-scheme" content="light dark">
	<title>Verify Your Account - OTP Code</title>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
	<style>
	  :root {
		--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		--secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		--accent-color: #6366f1;
		--success-color: #10b981;
		--text-primary: #111827;
		--text-secondary: #6b7280;
		--bg-primary: #ffffff;
		--bg-secondary: #f9fafb;
		--border-color: #e5e7eb;
		--shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		--shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	  }
  
	  * {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	  }
  
	  body {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		padding: 20px;
		line-height: 1.6;
		color: var(--text-primary);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	  }
  
	  .email-container {
		max-width: 600px;
		margin: 0 auto;
		background: var(--bg-primary);
		border-radius: 24px;
		overflow: hidden;
		box-shadow: var(--shadow);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
	  }
  
	  .header {
		background: var(--primary-gradient);
		padding: 40px 32px;
		text-align: center;
		position: relative;
		overflow: hidden;
	  }
  
	  .header::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
		opacity: 0.3;
	  }
  
	  .logo {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 24px;
	  }
  
	  .logo-icon {
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
	  }
  
	  .logo-text {
		font-size: 24px;
		font-weight: 700;
		color: white;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	  }
  
	  .header-title {
		position: relative;
		z-index: 1;
		font-size: 32px;
		font-weight: 700;
		color: white;
		margin-bottom: 8px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	  }
  
	  .header-subtitle {
		position: relative;
		z-index: 1;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
	  }
  
	  .content {
		padding: 48px 32px;
		background: var(--bg-primary);
	  }
  
	  .greeting {
		font-size: 20px;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 24px;
	  }
  
	  .message {
		font-size: 16px;
		color: var(--text-secondary);
		margin-bottom: 32px;
		line-height: 1.7;
	  }
  
	  .otp-container {
		background: var(--bg-secondary);
		border-radius: 20px;
		padding: 32px;
		text-align: center;
		margin: 32px 0;
		border: 2px solid var(--border-color);
		position: relative;
		overflow: hidden;
	  }
  
	  .otp-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--primary-gradient);
	  }
  
	  .otp-label {
		font-size: 14px;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 16px;
	  }
  
	  .otp-code {
		font-size: 36px;
		font-weight: 700;
		color: var(--accent-color);
		letter-spacing: 8px;
		margin-bottom: 16px;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
		text-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
	  }
  
	  .otp-validity {
		font-size: 14px;
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	  }
  
	  .validity-icon {
		width: 16px;
		height: 16px;
		background: var(--success-color);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	  }
  
	  .cta-button {
		display: inline-block;
		background: var(--primary-gradient);
		color: white;
		text-decoration: none;
		font-weight: 600;
		font-size: 16px;
		padding: 16px 32px;
		border-radius: 12px;
		transition: all 0.3s ease;
		box-shadow: var(--shadow-sm);
		border: none;
		cursor: pointer;
		text-align: center;
		margin: 24px 0;
	  }
  
	  .cta-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
	  }
  
	  .security-notice {
		background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
		border: 1px solid #f59e0b;
		border-radius: 16px;
		padding: 24px;
		margin: 32px 0;
		display: flex;
		align-items: flex-start;
		gap: 16px;
	  }
  

	  .security-text {
		font-size: 14px;
		color: #92400e;
		line-height: 1.6;
	  }
  
	  .footer {
		background: var(--bg-secondary);
		padding: 32px;
		text-align: center;
		border-top: 1px solid var(--border-color);
	  }
  
	  .footer-text {
		font-size: 14px;
		color: var(--text-secondary);
		margin-bottom: 16px;
	  }
  
	  .support-link {
		color: var(--accent-color);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
	  }
  
	  .support-link:hover {
		color: #4f46e5;
		text-decoration: underline;
	  }
  
	  .social-links {
		display: flex;
		justify-content: center;
		gap: 16px;
		margin-top: 24px;
	  }
  
	  .social-link {
		width: 40px;
		height: 40px;
		background: var(--bg-primary);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		transition: all 0.3s ease;
		box-shadow: var(--shadow-sm);
		border: 1px solid var(--border-color);
	  }
  
	  .social-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	  }
  
	  @media (max-width: 640px) {
		.email-container {
		  margin: 10px;
		  border-radius: 16px;
		}
		
		.header {
		  padding: 32px 24px;
		}
		
		.content {
		  padding: 32px 24px;
		}
		
		.header-title {
		  font-size: 28px;
		}
		
		.header-subtitle {
		  font-size: 16px;
		}
		
		.otp-code {
		  font-size: 32px;
		  letter-spacing: 4px;
		}
		
		.otp-container {
		  padding: 24px;
		}
		
		.footer {
		  padding: 24px;
		}
	  }
  
	  @media (prefers-color-scheme: dark) {
		:root {
		  --text-primary: #f9fafb;
		  --text-secondary: #9ca3af;
		  --bg-primary: #111827;
		  --bg-secondary: #1f2937;
		  --border-color: #374151;
		}
		
		.security-notice {
		  background: linear-gradient(135deg, #451a03 0%, #7c2d12 100%);
		  border-color: #ea580c;
		}
		
		.security-text {
		  color: #fed7aa;
		}
	  }
	</style>
  </head>
  <body>
	<div class="email-container">
	  <div class="header">
		<a href="https://pms-platform.vercel.app" class="logo">
		  <div class="logo-icon">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
			  <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linejoin="round"/>
			  <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linejoin="round"/>
			</svg>
		  </div>
		  <span class="logo-text">PMS</span>
		</a>
		<h1 class="header-title">Verify Your Account</h1>
		<p class="header-subtitle">We're excited to have you on board!</p>
	  </div>
  
	  <div class="content">
		<div class="greeting">Hello there!</div>
		
		<div class="message">
		  Thank you for joining PMS! To complete your registration and secure your account, please use the verification code below. This helps us ensure your account stays safe and protected.
		</div>
  
		<div class="otp-container">
		  <div class="otp-label">Your Verification Code</div>
		  <div class="otp-code">${otp}</div>
		  <div class="otp-validity">
			<div class="validity-icon">
			  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M2 5L4 7L8 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			  </svg>
			</div>
			Valid for 10 minutes
		  </div>
		</div>
  
		<div class="security-notice">
		  <div class="security-icon">
			<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			  <path d="M6 1L10 3V7C10 9 8 11 6 11C4 11 2 9 2 7V3L6 1Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		  </div>
		  <div class="security-text">
			<strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your verification code via phone or email.
		  </div>
		</div>
  
		<div class="message">
		  Once verified, you'll have full access to all PMS features and can start managing your projects efficiently. If you didn't request this verification, please ignore this email or contact our support team.
		</div>
	  </div>
  
	  <div class="footer">
		<div class="footer-text">
		  Need help? Our support team is here for you 24/7.<br>
		  Contact us at <a href="mailto:support@pms-platform.com" class="support-link">support@pms-platform.com</a>
		</div>
		
		<div class="social-links">
		  <a href="#" class="social-link" aria-label="Twitter">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
			  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
			</svg>
		  </a>
		  <a href="#" class="social-link" aria-label="LinkedIn">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
			  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
			</svg>
		  </a>
		  <a href="#" class="social-link" aria-label="GitHub">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
			  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
			</svg>
		  </a>
		</div>
	  </div>
	</div>
  </body>
  </html>`;
};
