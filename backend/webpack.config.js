const path = require('path');

module.exports = {
    mode: 'production', // Set webpack mode to production
    entry: './src/index.ts', // Entry point of your TypeScript application
    target: 'node', // Specify target environment as Node.js
    output: {
        filename: 'bundle.js', // Output file name
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    resolve: {
        extensions: ['.ts', '.js'], // Allow importing .ts and .js files without extension
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader', // Use ts-loader for TypeScript files
                exclude: /node_modules/,
            },
        ],
    },
};