# GROOM Wedding Invitation Website

A modern, elegant React-based website for GROOM, designed as an interactive wedding invitation card powered by the $GROOM token.

## Theme & Design

- **Style**: Clean, modern, solid pastel design
- **Colors**: Pastel pink background with pastel green accents
- **Typography**: Playfair Display for headlines, Inter for body text
- **No gradients, no emojis** - minimal yet romantic

## Features

### Interactive Wedding Card
- Closed invitation that opens with smooth flip animation
- Page-by-page navigation like flipping through a physical invitation

### Six Main Sections
1. **Cover Page** - Welcome with GROOM logo and invitation text
2. **Our Story** - The real couple's story behind GROOM
3. **Live Fund Tracker** - Real-time token data and wedding milestones
4. **After the Wedding** - NGO transformation and future mission
5. **Token Info** - Contract details, where to buy, tokenomics
6. **Contact & Community** - Social links and contact form

### Live Data Integration
- Token price, market cap, and 24h volume tracking
- Dynamic milestone progress bars
- Real-time fund updates

### Wedding Milestones
- $2,000 – Dress and Suit
- $3,000 – Wedding Rings
- $8,000 – Honeymoon
- $10,000 – Wedding Car
- $15,000 – Wedding Ceremony
- $100,000 – House

## Technology Stack

- **React 18** - Core framework
- **Framer Motion** - Animations and transitions
- **Axios** - API calls for live data
- **CSS3** - Custom styling with CSS variables
- **Responsive Design** - Mobile, tablet, and desktop support

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Configuration

### API Integration
To connect live token data, update the API endpoints in `src/components/LiveFundTracker.js`:
- Replace mock data with actual API calls to Dexscreener, CoinGecko, etc.
- Update the contract address in `src/components/TokenInfo.js`

### Social Links
Update social media links in `src/components/Contact.js`:
- Twitter/X
- Telegram
- Discord

### Customization
- Logo: Replace `/public/Logo-transparent.png` with your logo
- Colors: Modify CSS variables in `src/App.css`
- Content: Update text and story details in respective components

## Project Structure

```
groom/
├── public/
│   ├── index.html
│   └── Logo-transparent.png
├── src/
│   ├── components/
│   │   ├── WeddingCard.js
│   │   ├── WeddingCard.css
│   │   ├── CoverPage.js
│   │   ├── OurStory.js
│   │   ├── LiveFundTracker.js
│   │   ├── AfterWedding.js
│   │   ├── TokenInfo.js
│   │   └── Contact.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Token Integration

The website supports real-time integration with:
- **BagsApp** - Primary trading platform
- **Dexscreener** - Live charts and data
- **Basescan** - Contract exploration

### Token Utility
- 1% of trading volume redirected to wedding fund
- Community governance for future NGO decisions
- Transparent on-chain fund tracking

## Responsive Design

Optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Development Notes

- Uses Framer Motion for smooth page transitions
- CSS variables for consistent theming
- Modular component architecture
- Mock API calls (replace with real endpoints)
- Accessibility considerations included

## Future Enhancements

- Real API integration for live data
- Wallet connection for token holders
- Community voting interface
- Multi-language support
- Wedding countdown timer

---

**Built with love for the GROOM community** 💕