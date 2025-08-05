# SkillSprint - Skill Wallet & Micro-Gigs

> Government-verified skills platform for freelance opportunities

A production-ready proof of concept for the **ReviveNation Hackathon 2024**, demonstrating seamless integration between Government Sign-In (SLUDI), National Data Exchange (NDX) for education records, and National Payments Gateway (PayDPI) for secure payouts.

## 🏆 Team Information

**Team Name**: SkillSprint  
**Hackathon**: ReviveNation 2024  
**Category**: DPI Integration & Innovation

### Team Members
- **Lead Developer**: [Your Name] - [GitHub Handle]
- **Frontend Developer**: [Your Name] - [GitHub Handle]  
- **Backend Developer**: [Your Name] - [GitHub Handle]
- **UI/UX Designer**: [Your Name] - [GitHub Handle]

### Project Links
- **Repository**: [GitHub URL]
- **Live Demo**: [Demo URL]
- **Documentation**: See `docs/` folder for detailed problem statement and solution overview

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **pnpm** package manager (`npm install -g pnpm`)

### Setup & Run

```bash
# 1. Clone and navigate to project
git clone <repo-url>
cd skillsprint-revivenation-poc

# 2. Copy environment configuration
cp .env.example .env

# 3. Edit .env file with your values (see Configuration section)
# For demo purposes, you can leave USE_MOCK=true

# 4. Install dependencies
pnpm install

# 5. Start development servers (API + Web)
pnpm dev
```

**That's it!** 🎉 

- **API Server**: http://localhost:3003
- **Web Interface**: http://localhost:3000

## 📋 Hackathon Requirements

### ✅ Required Deliverables
- **Problem Statement**: `docs/problem.md`
- **Solution Overview**: `docs/solution.md`  
- **Proof of Concept**: `src/` - SLUDI → NDX → PayDPI flow
- **Setup Instructions**: This README

### ✅ Updated Requirements (Aug 2, 2025)
- ✅ **SLUDI**: MOSIP 1.2.0 specification
- ✅ **NDX**: WSO2 Choreo ready
- ⏳ **PayDPI**: Awaiting Aug 5th spec

### 🚀 Demo Ready
```bash
pnpm install
pnpm dev
# http://localhost:3000
```

## 🎯 Demo Flow (2-minute walkthrough)

1. **Open** http://localhost:3000
2. **Sign In**: Click "Sign in with Government ID" → Enter any phone → Enter any 6-digit OTP
3. **Education**: Check consent → Click "Fetch my education record" → See verified skills
4. **Gig**: Click "Accept Gig" on any job → Watch payment status: "Initiated" → "Paid" (3 seconds)
5. **Done**: See toast notification "Payment completed via National Payments Gateway"

## 📁 Project Structure

This repository follows the ReviveNation Hackathon submission guidelines:

```
skillsprint-revivenation-poc/
├── README.md                    # Project overview & setup instructions
├── docs/                        # Hackathon required documentation
│   ├── problem.md              # Problem statement & pain points
│   └── solution.md             # Solution architecture & DPI integration
├── src/                         # Proof of Concept (POC) code
│   ├── api/                    # Backend (Express)
│   │   ├── index.ts            # Main server
│   │   └── routes/             # API endpoints
│   ├── lib/                    # Utilities
│   ├── middleware/             # Express middleware
│   └── fixtures/               # Mock data
├── web/                        # Frontend (Next.js)
│   ├── app/                    # Pages & sections
│   ├── components/             # Reusable UI
│   ├── lib/                    # Client utilities
│   └── styles/                 # CSS & theme
├── postman/                    # API testing
│   ├── SkillSprint.postman_collection.json
│   └── SkillSprint.postman_environment.json
├── openapi.yaml                # API specification
├── package.json                # Dependencies & scripts
└── .env.example               # Environment template
```

### 📋 Hackathon Compliance

✅ **Required Structure**: Matches official guidelines exactly  
✅ **Problem Statement**: `docs/problem.md` - Clear pain point definition  
✅ **Solution Overview**: `docs/solution.md` - Detailed DPI integration  
✅ **Working POC**: `src/` - Complete SLUDI → NDX → PayDPI flow  
✅ **Setup Instructions**: This README with build/run commands

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Mock Default | Required for Sandbox |
|----------|-------------|--------------|---------------------|
| `USE_MOCK` | Enable mock mode | `true` | Set to `false` |
| `SLUDI_CLIENT_ID` | Government Sign-In client | - | ✅ |
| `SLUDI_CLIENT_SECRET` | Government Sign-In secret | - | ✅ |
| `NDX_BASE_URL` | National Data Exchange URL | Mock endpoint | ✅ |
| `NDX_API_KEY` | NDX API token | - | ✅ |
| `PAYDPI_BASE_URL` | Payments Gateway URL | Mock endpoint | ✅ |
| `PAYDPI_MERCHANT_ID` | Merchant ID | `demo-merchant` | ✅ |
| `PAYDPI_SECRET` | HMAC signature secret | `supersecret` | ✅ |

### Mock vs Sandbox Mode

**🎭 Mock Mode** (`USE_MOCK=true` - Default)
- All services simulated locally
- No external API calls
- Perfect for development & demo
- **Hackathon Demo Ready**: Use this mode for judging

**🔗 Sandbox Mode** (`USE_MOCK=false`)
- Real government services integration
- External API dependencies
- Production-like behavior
- **Production Ready**: Use this mode for real government integration

To switch to Sandbox:
1. Set `USE_MOCK=false` in `.env`
2. Fill all required credentials (see Configuration section)
3. Restart server: `pnpm dev`

### 🏆 Hackathon Judging Setup

For hackathon evaluation, the project runs in **Mock Mode** by default, providing:
- ✅ Complete end-to-end DPI flow demonstration
- ✅ No external dependencies or API keys required
- ✅ Instant setup and demo capability
- ✅ Full functionality with simulated government services

## 🔌 API Endpoints

### Authentication (MOSIP 1.2.0 Compliant)
- `POST /api/auth/login` - Initiate OTP login (requires requestId)
- `POST /api/auth/verify` - Verify OTP & get session (requires requestId)
- `GET /api/auth/claims` - Get user claims
- `GET /api/auth/health` - MOSIP health check

### National Data Exchange
- `POST /api/nde/education` - Fetch education records

### Gigs & Payments
- `GET /v1/gigs` - List available gigs
- `POST /api/paydpi` - Initiate payout
- `GET /api/paydpi/status` - Check payout status

### Webhooks
- `POST /v1/payouts/webhook` - Payment status updates (HMAC verified)

### Health
- `GET /health` - API health check

## 🧪 Testing with Postman

1. **Import Collection**: `postman/SkillSprint.postman_collection.json`
2. **Import Environment**: `postman/SkillSprint.postman_environment.json`
3. **Update Environment**:
   - Set `BASE_URL` to `http://localhost:3001`
   - Set `PAYDPI_SECRET` to match your `.env`
4. **Run Tests**: Execute requests in order (Auth → NDX → Gigs → Payments)

### Webhook Testing

The collection includes HMAC signature generation:

```bash
# Or test webhook manually with computed signature
pnpm test:webhook
```

## 🎨 UI Components & Testing

### Data-Test Attributes

Key UI elements include `data-test` attributes for easy automation:

- `btn-signin` - Sign in button
- `btn-consent` - Consent checkbox  
- `btn-fetch-education` - Fetch education button
- `btn-accept-gig` - Accept gig button
- `auth-status` - Authentication status chip
- `education-status` - Education fetch status chip
- `payment-status` - Payment status chip

### Dark Theme

- **Colors**: Near-black backgrounds, emerald/cyan accents
- **Design**: Rounded corners, soft shadows, professional look
- **Responsive**: Mobile-first design with Tailwind CSS

## 🔄 Switching to Production

### Real Government Services Integration

1. **National Digital ID (MOSIP)**:
   ```bash
   # Update .env
   SLUDI_ISSUER=https://mosip.gov.lk/auth
   SLUDI_CLIENT_ID=your_client_id
   SLUDI_CLIENT_SECRET=your_client_secret
   ```

2. **National Data Exchange (API Manager)**:
   ```bash
   # Update .env  
   NDX_BASE_URL=https://choreo.wso2.com/your-org/education
   NDX_API_KEY=your_api_key
   ```

3. **National Payments Gateway**:
   ```bash
   # Update .env
   PAYDPI_BASE_URL=https://payments.gov.lk
   PAYDPI_MERCHANT_ID=your_merchant_id
   PAYDPI_SECRET=your_webhook_secret
   ```

4. **Webhook Setup**:
   - Expose webhook endpoint: `https://your-domain.com/v1/payouts/webhook`
   - Register with payments ministry
   - HMAC verification remains unchanged

## 🚨 Troubleshooting

### Common Issues

**API Server won't start**
```bash
# Check if port 3001 is in use
lsof -i :3001
# Kill process if needed
kill -9 <PID>
```

**Environment validation fails**
```bash
# When USE_MOCK=false, ensure all required vars are set
grep -v "^#" .env | grep "="
```

**OIDC redirect mismatch**
- Verify `SLUDI_REDIRECT_URI` matches registered callback
- Check government sign-in service configuration

**401/403 from NDX**
- Validate `NDX_API_KEY` permissions
- Check API Manager rate limits
- Verify `NDX_BASE_URL` endpoint accessibility

**429 Rate Limited**
- Implement exponential backoff
- Check service quotas
- Contact API provider

**Webhook not hitting**
- Verify public URL accessibility
- Check firewall/proxy settings
- Ensure HTTPS for production webhooks

**HMAC validation fails**
- Verify `PAYDPI_SECRET` matches ministry configuration
- Check raw body handling (no JSON parsing before verification)
- Ensure exact same payload used in signature

**Frontend build fails**
```bash
# Clear Next.js cache
cd web && rm -rf .next
# Reinstall dependencies
pnpm install
```

### Development Tips

**Hot reload not working**
```bash
# Restart dev servers
pnpm dev
```

**Database/session issues**
```bash
# Restart API (clears in-memory stores)
# Sessions are stored in memory for demo
```

## 📋 Submission Checklist (Aug 7)

### ✅ Functional Requirements
- [ ] Government Sign-In (MOSIP OTP) working
- [ ] National Data Exchange integration complete
- [ ] National Payments Gateway with webhook handling
- [ ] End-to-end flow: Sign-in → Education → Gig → Payment
- [ ] Dark, elegant UI with proper status indicators
- [ ] Mock/Sandbox mode toggle working

### ✅ Technical Requirements  
- [ ] TypeScript implementation
- [ ] Express backend with all routes
- [ ] Next.js frontend with App Router
- [ ] OpenAPI specification complete
- [ ] Postman collection functional
- [ ] HMAC webhook security implemented
- [ ] Error handling and logging
- [ ] Responsive design

### ✅ Documentation
- [ ] README with setup instructions
- [ ] Environment configuration guide
- [ ] API endpoints documented
- [ ] Troubleshooting section
- [ ] Demo flow described

### ✅ Security & Quality
- [ ] No hard-coded secrets
- [ ] CORS properly configured
- [ ] HMAC signature verification
- [ ] Input validation
- [ ] Error boundaries
- [ ] Clean code structure

## 📚 Additional Resources

- **OpenAPI Spec**: View at `http://localhost:3001/api-docs` (Sprint 2)
- **Logs**: Check console output for request/response details
- **Government APIs**: Integration guides in respective service docs

## 🤝 Support

- **Issues**: Report bugs and feature requests
- **Documentation**: API specification in `openapi.yaml`
- **Testing**: Use Postman collection for endpoint validation

---

**Built for ReviveNation Hackathon 2024** 🇱🇰

*Empowering citizens through verified skills and secure digital payments*