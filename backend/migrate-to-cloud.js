/**
 * Migration Script: Local SQLite to Strapi Cloud
 * 
 * This script reads articles from the local SQLite database and
 * pushes them to Strapi Cloud using the REST API.
 * 
 * Usage:
 *   cd backend
 *   STRAPI_CLOUD_URL=https://weqaya-xxx.strapiapp.com STRAPI_API_TOKEN=xxx node migrate-to-cloud.js
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const CLOUD_URL = process.env.STRAPI_CLOUD_URL || 'https://weqaya-376a5d5eac.strapiapp.com';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
    console.error('❌ ERROR: STRAPI_API_TOKEN environment variable is required');
    console.log('\nTo create an API Token:');
    console.log('1. Go to your Strapi Cloud Admin: ' + CLOUD_URL + '/admin');
    console.log('2. Settings → API Tokens → Add new API token');
    console.log('3. Name: "Migration", Token type: "Full access"');
    console.log('4. Copy the token and run:');
    console.log(`   STRAPI_API_TOKEN=your_token node migrate-to-cloud.js\n`);
    process.exit(1);
}

async function makeRequest(endpoint, method = 'GET', body = null) {
    const url = `${CLOUD_URL}/api${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        console.error(`API Error (${response.status}):`, JSON.stringify(data, null, 2));
        throw new Error(`API request failed: ${response.status}`);
    }

    return data;
}

async function migrateCategories(db) {
    console.log('\n📁 Migrating categories...');

    const categories = db.prepare(`
    SELECT DISTINCT document_id, name, slug 
    FROM categories 
    WHERE published_at IS NOT NULL
  `).all();

    for (const cat of categories) {
        try {
            // Check if category exists
            const existing = await makeRequest(`/categories?filters[slug][$eq]=${cat.slug}`);

            if (existing.data && existing.data.length > 0) {
                console.log(`  ✓ Category "${cat.name}" already exists`);
                continue;
            }

            // Create category
            await makeRequest('/categories', 'POST', {
                data: {
                    name: cat.name,
                    slug: cat.slug
                }
            });
            console.log(`  ✓ Created category: ${cat.name}`);
        } catch (err) {
            console.log(`  ⚠ Failed to migrate category "${cat.name}": ${err.message}`);
        }
    }
}

async function migrateArticles(db) {
    console.log('\n📄 Migrating articles...');

    // Get all published articles with distinct document_id
    const articles = db.prepare(`
    SELECT a.document_id, a.title, a.description, a.content, a.slug,
           c.slug as category_slug
    FROM articles a
    LEFT JOIN articles_category_lnk acl ON a.id = acl.article_id
    LEFT JOIN categories c ON acl.category_id = c.id
    WHERE a.published_at IS NOT NULL
    GROUP BY a.document_id
  `).all();

    console.log(`  Found ${articles.length} articles to migrate`);

    let success = 0;
    let failed = 0;

    for (const article of articles) {
        try {
            // Check if article already exists
            const existing = await makeRequest(`/articles?filters[slug][$eq]=${encodeURIComponent(article.slug)}`);

            if (existing.data && existing.data.length > 0) {
                console.log(`  ✓ Article "${article.title.substring(0, 40)}..." already exists`);
                success++;
                continue;
            }

            // Get category ID if exists
            let categoryId = null;
            if (article.category_slug) {
                const catRes = await makeRequest(`/categories?filters[slug][$eq]=${article.category_slug}`);
                if (catRes.data && catRes.data.length > 0) {
                    categoryId = catRes.data[0].id;
                }
            }

            // Create article
            const articleData = {
                title: article.title,
                description: article.description || '',
                content: article.content || '',
                slug: article.slug
            };

            if (categoryId) {
                articleData.category = categoryId;
            }

            await makeRequest('/articles', 'POST', { data: articleData });
            console.log(`  ✓ Created article: ${article.title.substring(0, 40)}...`);
            success++;
        } catch (err) {
            console.log(`  ✗ Failed: ${article.title.substring(0, 40)}... - ${err.message}`);
            failed++;
        }
    }

    console.log(`\n📊 Migration complete: ${success} succeeded, ${failed} failed`);
}

async function main() {
    console.log('🚀 Strapi Content Migration Script');
    console.log('===================================');
    console.log(`Source: Local SQLite (.tmp/data.db)`);
    console.log(`Target: ${CLOUD_URL}`);

    // Open local database
    const dbPath = path.join(__dirname, '.tmp', 'data.db');
    if (!fs.existsSync(dbPath)) {
        console.error(`❌ Database not found: ${dbPath}`);
        process.exit(1);
    }

    const db = new Database(dbPath, { readonly: true });

    try {
        // Test connection to cloud
        console.log('\n🔗 Testing connection to Strapi Cloud...');
        await makeRequest('/articles?pagination[limit]=1');
        console.log('  ✓ Connection successful!');

        // Migrate
        await migrateCategories(db);
        await migrateArticles(db);

        console.log('\n✅ Migration finished!');
        console.log('   Note: Images were not migrated. Upload them manually in the Cloud Admin.');

    } catch (err) {
        console.error('\n❌ Migration failed:', err.message);
    } finally {
        db.close();
    }
}

main();
