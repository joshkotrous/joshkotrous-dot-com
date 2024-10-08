/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://joshkotrous.com', // Replace with your site's URL
    generateRobotsTxt: true,  // (optional) Generate a robots.txt file
    exclude: ['/admin/*'], // (optional) Exclude certain pages from the sitemap
  };