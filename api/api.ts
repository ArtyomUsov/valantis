import md5 from 'md5';

export const fetchProducts = async (params: { action: string; params: { offset: number; limit: number; }; }) => {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, ''); 
    const authString = md5(`Valantis_${timestamp}`); 
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth': authString,
      },
      body: JSON.stringify(params),
    };
  
    try {
      const response = await fetch('http://api.valantis.store:40000/', requestOptions);
      if (!response.ok) {
        throw new Error('Ошибка при запросе к API');
      }
      const data = await response.json();
      console.log(data.result);
      
      return data.result;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  