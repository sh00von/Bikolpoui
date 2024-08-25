// pages/api/products.js
export default async function handler(req, res) {
  try {
    const response = await fetch('https://theinquilab.com/BikolpoBackend/products/');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
