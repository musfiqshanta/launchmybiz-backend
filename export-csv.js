const fs = require('fs');
const path = require('path');

// Function to convert JSON results to CSV
function convertToCSV(results) {
    const csvRows = [];
    
    // CSV header
    csvRows.push([
        'State Name',
        'State Abbr',
        'Success',
        'Package ID',
        'Package Name',
        'Service Fee',
        'State Fees',
        'Shipping & Handling',
        'Total Price',
        'Is Default Package',
        'Sort Order',
        'Feature Groups Count',
        'Error'
    ].join(','));
    
    // CSV data rows
    results.forEach(result => {
        if (result.success && result.packages && result.packages.length > 0) {
            result.packages.forEach(package => {
                const featureGroupsCount = package.featureGroups ? package.featureGroups.length : 0;
                
                csvRows.push([
                    `"${result.stateName}"`,
                    `"${result.stateAbbr}"`,
                    'true',
                    `"${package.id}"`,
                    `"${package.name}"`,
                    `"${package.price}"`,
                    `"${package.stateFees}"`,
                    `"${package.shippingHandlingFees}"`,
                    `"${package.totalPrice}"`,
                    package.isDefaultPackage ? 'true' : 'false',
                    package.sortOrder || 0,
                    featureGroupsCount,
                    ''
                ].join(','));
            });
        } else {
            // Add a row for failed states
            csvRows.push([
                `"${result.stateName}"`,
                `"${result.stateAbbr}"`,
                'false',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                `"${result.error || 'No packages found'}"`
            ].join(','));
        }
    });
    
    return csvRows.join('\n');
}

// Function to find the most recent JSON file
function findLatestJSONFile() {
    const files = fs.readdirSync(__dirname)
        .filter(file => file.startsWith('state-package-prices-') && file.endsWith('.json'))
        .sort()
        .reverse();
    
    if (files.length === 0) {
        throw new Error('No state package price JSON files found. Run the main script first.');
    }
    
    return files[0];
}

// Main function
function main() {
    try {
        console.log('Looking for the most recent state package prices JSON file...');
        
        const jsonFilename = findLatestJSONFile();
        const jsonFilepath = path.join(__dirname, jsonFilename);
        
        console.log(`Found file: ${jsonFilename}`);
        
        // Read the JSON file
        const jsonData = JSON.parse(fs.readFileSync(jsonFilepath, 'utf8'));
        
        console.log(`Processing ${jsonData.results.length} states...`);
        
        // Convert to CSV
        const csvData = convertToCSV(jsonData.results);
        
        // Generate CSV filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const csvFilename = `state-package-prices-${timestamp}.csv`;
        const csvFilepath = path.join(__dirname, csvFilename);
        
        // Write CSV file
        fs.writeFileSync(csvFilepath, csvData);
        
        console.log(`CSV file created: ${csvFilename}`);
        console.log(`Total rows: ${csvData.split('\n').length - 1}`);
        
        // Also create a summary CSV
        const summaryCSV = createSummaryCSV(jsonData.results);
        const summaryCSVFilename = `state-package-summary-${timestamp}.csv`;
        const summaryCSVFilepath = path.join(__dirname, summaryCSVFilename);
        
        fs.writeFileSync(summaryCSVFilepath, summaryCSV);
        console.log(`Summary CSV file created: ${summaryCSVFilename}`);
        
    } catch (error) {
        console.error('Error converting to CSV:', error.message);
        process.exit(1);
    }
}

// Function to create a summary CSV
function createSummaryCSV(results) {
    const csvRows = [];
    
    // CSV header
    csvRows.push([
        'State Name',
        'State Abbr',
        'Success',
        'Package Count',
        'Lowest Price',
        'Highest Price',
        'Default Package Price',
        'Error'
    ].join(','));
    
    // CSV data rows
    results.forEach(result => {
        if (result.success && result.packages && result.packages.length > 0) {
            const prices = result.packages.map(pkg => pkg.numericTotalPrice).filter(price => price > 0);
            const defaultPackage = result.packages.find(pkg => pkg.isDefaultPackage);
            
            csvRows.push([
                `"${result.stateName}"`,
                `"${result.stateAbbr}"`,
                'true',
                result.packages.length,
                prices.length > 0 ? Math.min(...prices).toFixed(2) : '',
                prices.length > 0 ? Math.max(...prices).toFixed(2) : '',
                defaultPackage ? defaultPackage.totalPrice : '',
                ''
            ].join(','));
        } else {
            csvRows.push([
                `"${result.stateName}"`,
                `"${result.stateAbbr}"`,
                'false',
                0,
                '',
                '',
                '',
                `"${result.error || 'No packages found'}"`
            ].join(','));
        }
    });
    
    return csvRows.join('\n');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    convertToCSV,
    createSummaryCSV
}; 