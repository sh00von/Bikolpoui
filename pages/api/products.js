export default async function handler(req, res) {
    try {
      const response = await fetch('https://theinquilab.com/BikolpoBackend/products/?format=json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  