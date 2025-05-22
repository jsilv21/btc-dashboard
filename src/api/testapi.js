export const fetchPriceData = async () => {
  const url = "https://mempool.space/api/v1/prices";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const rawdata = await fetchPriceData();

console.log(rawdata);
