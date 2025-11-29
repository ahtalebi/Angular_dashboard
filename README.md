# 🌍 Population Dashboard

An interactive web-based dashboard for visualizing global population data from 1960-2023.

![Dashboard Preview](screenshot.png)

## Features

- 📊 **Interactive Line Charts** - Track population trends over time
- 📈 **Bar Charts** - Compare top 10 countries by population
- 🔍 **Dynamic Filters** - Filter by country and year
- 📋 **Data Table** - View and explore raw data
- 🎨 **Modern UI** - Beautiful gradient design with responsive layout

## Tech Stack

- **Framework**: Angular 21
- **Charts**: Chart.js
- **Language**: TypeScript
- **Styling**: CSS3

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/population-dashboard.git
cd population-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
ng serve
```

4. Open your browser to `http://localhost:4200`

## Data Source

The dashboard uses population data with the following structure:
- Country Name
- Country Code
- Year (1960-2023)
- Population Value

## Project Structure
```
src/
├── app/
│   ├── dashboard/              # Main dashboard component
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.css
│   ├── data.service.ts         # CSV data loading service
│   └── app.ts                  # Root component
└── public/
    └── data.csv                # Population dataset
```

## Usage

1. **View Population Trends**: The line chart shows population changes over time for selected countries
2. **Compare Countries**: The bar chart displays the top 10 most populous countries for any selected year
3. **Filter Data**: Use the dropdown menus to filter by specific country or year
4. **Explore Data**: Scroll through the data table to see detailed records

## Building for Production
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

### GitHub Pages
```bash
ng build --base-href "/population-dashboard/"
npx angular-cli-ghpages --dir=dist/my-dashboard/browser
```

### Vercel/Netlify
Simply connect your GitHub repository and they'll auto-deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or production.

## Author

Your Name - [Your GitHub Profile](https://github.com/YOUR_USERNAME)

## Acknowledgments

- Population data source: [Add your data source here]
- Built with Angular and Chart.js
- Inspired by modern data visualization tools
