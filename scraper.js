const Parser = require('rss-parser');

async function fetchPoliticalNews() {
    const rssFeeds = [
        'https://feeds.bbci.co.uk/news/politics/rss.xml',
        'https://www.theguardian.com/politics/rss',
      //  'https://www.politico.com/rss/politicopicks.xml',
        // Note: Reuters feed removed due to XML parsing errors
        'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml'
    ];

    const parser = new Parser({
        timeout: 10000, // 10 second timeout
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    const allNews = [];

    for (const feedUrl of rssFeeds) {
        try {
            console.log(`Fetching: ${feedUrl}`);
            
            // Try direct fetch first
            const response = await fetch(feedUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const xmlText = await response.text();
            
            // Check if the response is actually XML
            if (!xmlText.trim().startsWith('<?xml') && !xmlText.includes('<rss')) {
                console.warn(`Feed ${feedUrl} returned non-XML content. Might be blocked.`);
                continue;
            }
            
            // Parse the XML
            const feed = await parser.parseString(xmlText);
            
            if (!feed.items || feed.items.length === 0) {
                console.warn(`No items found in feed: ${feedUrl}`);
                continue;
            }
            
            // Filter for political content
            const politicalKeywords = [
                'politics', 'election', 'government', 'congress', 'parliament',
                'senate', 'president', 'prime minister', 'vote', 'policy',
                'minister', 'campaign', 'democrat', 'republican', 'trump',
                'biden', 'starmer', 'labour', 'conservative', 'tory'
            ];
            
            feed.items.forEach(item => {
                const title = item.title || '';
                const description = item.contentSnippet || item.content || '';
                const combinedText = (title + ' ' + description).toLowerCase();
                
                const isPolitical = politicalKeywords.some(keyword => 
                    combinedText.includes(keyword.toLowerCase())
                );
                
                if (isPolitical) {
                    allNews.push({
                        title: title,
                        link: item.link || '',
                        description: description.substring(0, 200) + '...',
                        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                        source: new URL(feedUrl).hostname
                    });
                }
            });
            
            console.log(`✓ Successfully processed ${feed.items.length} items from ${feedUrl}`);
            
        } catch (error) {
            console.error(`✗ Error with ${feedUrl}:`, error.message);
            
            // Optional: Try with proxy as fallback for blocked feeds
            try {
                console.log(`Trying proxy fallback for ${feedUrl}...`);
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
                const proxyResponse = await fetch(proxyUrl);
                const proxyData = await proxyResponse.json();
                
                if (proxyData.contents) {
                    const feed = await parser.parseString(proxyData.contents);
                    
                    // Filter and process as above...
                    feed.items.forEach(item => {
                        const title = item.title || '';
                        const description = item.contentSnippet || item.content || '';
                        const combinedText = (title + ' ' + description).toLowerCase();
                        
                        const isPolitical = politicalKeywords.some(keyword => 
                            combinedText.includes(keyword.toLowerCase())
                        );
                        
                        if (isPolitical) {
                            allNews.push({
                                title: title,
                                link: item.link || '',
                                description: description.substring(0, 200) + '...',
                                pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                                source: new URL(feedUrl).hostname
                            });
                        }
                    });
                    
                    console.log(`✓ Proxy fallback successful for ${feedUrl}`);
                }
            } catch (proxyError) {
                console.error(`✗ Proxy fallback also failed for ${feedUrl}:`, proxyError.message);
            }
        }
    }

    // Sort by date (newest first) and remove duplicates
    const uniqueNews = [];
    const seenLinks = new Set();
    
    allNews.sort((a, b) => b.pubDate - a.pubDate);
    
    for (const item of allNews) {
        if (!seenLinks.has(item.link)) {
            seenLinks.add(item.link);
            uniqueNews.push(item);
        }
    }
    
    return uniqueNews;
}

// Display results with better formatting
function displayNews(newsItems) {
    console.log(`\n📰 POLITICAL NEWS FETCHER`);
    console.log(`==============================\n`);
    console.log(`Fetched ${newsItems.length} unique political news items:\n`);
    
    newsItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   📝 ${item.description}`);
        console.log(`   🔗 Source: ${item.source}`);
        console.log(`   📅 ${item.pubDate.toLocaleDateString()} ${item.pubDate.toLocaleTimeString()}`);
        console.log(`   🌐 ${item.link}\n`);
    });
}

// Main execution
async function main() {
    console.log('Starting political news scraper...\n');
    const news = await fetchPoliticalNews();
    
    if (news.length > 0) {
        displayNews(news);
        
        // Optional: Save to JSON file
        const fs = require('fs');
        fs.writeFileSync('political-news.json', JSON.stringify(news, null, 2));
        console.log(`\n✅ Results saved to political-news.json`);
    } else {
        console.log('\n❌ No political news found.');
    }
}

// Handle any uncaught errors
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1);
});

// Run the scraper
main();