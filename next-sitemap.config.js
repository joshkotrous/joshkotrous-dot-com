/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://joshkotrous.com',
    generateRobotsTxt: true, // Generate a robots.txt file
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    
    // Exclude paths that end with .png, .jpg, .jpeg, etc.
    exclude: [
      '*.png', // Exclude all .png files
      '*.jpg', // Exclude all .jpg files
      '*.jpeg', // Exclude all .jpeg files
      '*.svg', // Exclude all .svg files
      '*.gif', // Exclude all .gif files
    ],
  };