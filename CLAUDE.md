# CLAUDE.md - Project Memory

## Project Overview
**Logiciel France** - French SaaS directory showcasing French tech companies and their software solutions. The project promotes "Made in France" and facilitates connections between French software publishers and potential clients/partners.

## Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Styling**: Plain CSS (no external CSS frameworks)
- **Data Source**: Google Sheets API via REST service
- **Build Tool**: Create React App (not Vite as mentioned in README)
- **Language**: French (UI and content)

## Project Structure
- `src/components/` - React components
- `src/pages/` - Application pages 
- `src/utils/` - Utility functions (API, search, slugify, metrics)
- `public/` - Static assets including company logos and screenshots
- `scripts/` - Build scripts for sitemap generation and IndexNow

## Key Rules & Conventions
- Do not write CSS code inside pages or components but in the index.css file. 
- Always look for the cleanest and easiest code.

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes sitemap generation)
- `npm run test` - Run tests
- `npm run generate-sitemap` - Generate sitemap from Google Sheets data
- `npm run indexnow` - Submit URLs to search engines

### Code Style
- Use TypeScript for all React components
- Follow existing plain CSS approach (no CSS-in-JS or frameworks)
- French language for UI text and comments
- Use existing utility functions in `src/utils/`

### Data Management
- Data comes from Google Sheets: https://docs.google.com/spreadsheets/d/1WoUB3iTejzgFtf3iCs-PN6d88lxuop_VlhOyrhD1HiQ/edit?gid=0
- API calls handled in `src/utils/api.ts`
- Search functionality in `src/utils/search.ts`
- URL slugification in `src/utils/slugify.ts`

### Important Notes
- This is a French project - maintain French language in UI
- SEO is important - canonical URLs and proper meta tags required
- Company assets are stored in `public/asset/[company-name]/`
- Categories have dedicated icons in `public/icons/`
- Always run `npm run build` before production deployment to generate fresh sitemap

### File Naming
- React components: PascalCase (e.g., `CompanySkeleton.tsx`)
- Pages: PascalCase (e.g., `AllSoftwares.tsx`)
- Utilities: camelCase (e.g., `useMetrics.ts`)
- CSS files: match component names

### Testing
- Uses React Testing Library
- Test files should be co-located or in `__tests__` directories
- Run tests with `npm run test`

### Git Workflow
- Main branch: `main`
- Current development branch: `development`
- Follow semantic commit messages in French when appropriate