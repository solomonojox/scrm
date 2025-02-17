import { API_BASE_URL } from "../../Components/Confiigurations/variablesProvider";
import ConsumeApi from "../../Utilities/ApiConsumptionFunctions";
import { mockData } from "./allProductsMock";

export function getMockData() {
try {
    if (mockData.Data != null && mockData.Data != undefined) {
      return mockData.Data;
    } else {
      console.log("FAILED TO GET DATA FROM MOCK DATA");
      return null;
    }
} catch (error) {
  console.error(error);
}
}

export async function getLiveData() {
  try {
    // Use the ConsumeApi utility to fetch data from the API
    const response = await ConsumeApi("/api/Products/GetAll", 'GET');

    if (response && response.Status && response.Data) {
      console.log(response.Data);
      const mappedResponse = response.Data.map(product => ({
        itemId: product.productItemId,
        itemCode: product.productId,
        itemName: product.productName,
        itemDescription: product.productShortDescription,
        itemLongDescription: product.productLongDescription,
        itemPrice: product.productSellingPrice / 1000,
        itemCategory: product.productCategoryCSV,
        itemTags: ["soda", "cola", "beverage"], // This can be adjusted based on your actual data
        itemRating: 5, // Placeholder rating, adjust as needed
        itemImageUrl: `${API_BASE_URL}/${product.productImageUrl}`, // Use API_BASE_URL for consistency
      }));

      return mappedResponse; 
    } else {
      console.log("FAILED TO GET DATA FROM LIVE API");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
