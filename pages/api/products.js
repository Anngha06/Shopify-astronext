import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_PRIVATE_ACCESS_TOKEN;

  if (!domain || !token) {
    return res.status(500).json({ message: 'Missing Shopify credentials' });
  }

  const client = createStorefrontApiClient({
    storeDomain: `https://${domain}`,
    apiVersion: '2026-07',
    privateAccessToken: token,
    customFetchApi: fetch,
    retries: 2,
  });

  const query = `
    query Products {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const { data, errors } = await client.request(query);

    if (errors) {
      console.error('Shopify API errors:', errors);
      return res.status(500).json({ error: 'Failed to fetch products', details: errors });
    }

    if (!data?.products?.edges) {
      return res.status(200).json({ products: [] });
    }

    const products = data.products.edges.map((edge) => {
      const node = edge.node;
      const price = node.priceRange.minVariantPrice;
      const imageUrl = node.images.edges[0]?.node.url || null;
      const variantId = node.variants.edges[0]?.node.id || null;

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        price: {
          amount: price.amount,
          currency: price.currencyCode,
        },
        image: imageUrl,
        variantId: variantId,
      };
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}