import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';
import reviewData from '../data/reviews.json';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Function to trigger a download of JSON data with a fixed filename
const downloadToGeminiParsed = (data: any) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'geminiParsed.json'; // Fixed filename
  a.click();
  
  URL.revokeObjectURL(url);
  console.log('Analysis saved to geminiParsed.json');
};

export const analyzeRestaurants = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
    Wszystkie recenzje są w języku polskim. Proszę, przeprowadź analizę oraz generuj odpowiedzi w języku polskim.

    You are given a JSON array of restaurant reviews. Each review contains the following fields:
      - restaurantName
      - rating
      - textReviews
      - averagePrice

    Your task is to perform the following steps for each restaurant:

    1. **Extraction:**  
       Extract the four fields (restaurantName, rating, textReviews, averagePrice) from each review.
    
    2. **Portion-Based Rating:**  
       For each review, analyze the "textReviews" field and assign a portion-based rating (from 1 to 10) using a function f(review) that only considers the description of the portion size.  
       For instance, keywords like "ogromne", "duże", "hojne" should result in a higher score, while words like "małe", 
       "mikroskopijne", "niewystarczające" should result in a lower score. Just partition words that in polish mean "big" or "small". 
       For example: "Ogromne" should result in a higher score, while "małe" should result in a lower score.
    
    3. **Aggregate per Restaurant:**  
       For each restaurant (group reviews by restaurantName), compute the following:
       - avg_f: The average of the portion-based ratings assigned by f(review).
       - avg_rating: The average of the original "rating" values.
       - avg_price: The average of the "averagePrice" values.
    
    4. **Value for Money Calculation:**  
       For each restaurant, calculate the value for money score using the formula:
       
           compareFun = avg_f × avg_rating × (1 / avg_price)
       
       This score represents the balance between portion size, overall quality (original rating), and cost.
    
    5. **Output:**  
       Provide:
         - Which restaurant offers the best value for money (highest compareFun score).
         - A ranking of restaurants based on the compareFun score.
         - Specific details about portion sizes mentioned in the reviews.
         - Any price-related praises or concerns mentioned in the reviews.
    
    Please provide your output in clear JSON format.
    
    JSON Data:
    ${JSON.stringify(reviewData.reviews, null, 2)}
    `;
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const outputText = await response.text();

        // Remove markdown formatting (```json and ```)
        const cleanOutput = outputText
            .replace(/^```json\s*/m, '')  // remove starting ```json
            .replace(/```$/m, '');         // remove trailing ```
        
        // Parse the cleaned output to ensure it's valid JSON
        const parsedOutput = JSON.parse(cleanOutput);
        
        // Store in localStorage
        localStorage.setItem('geminiData', JSON.stringify(parsedOutput));
        
        // Download to geminiParsed.json
        downloadToGeminiParsed(parsedOutput);
        
        // Return a readable version of the data
        return JSON.stringify(parsedOutput, null, 2);
    } catch (error) {
        console.error('Error analyzing restaurants:', error);
        throw error;
    }
};
