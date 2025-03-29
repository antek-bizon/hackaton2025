import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

// Use environment variable or hard-coded key (for demo purposes only)
const GEMINI_API_KEY = "AIzaSyDwMduRX6cq2EDZkrlbt01ku83-uEkP2gk";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Function to save data to Firestore
const saveToFirestore = async (data: any) => {
  try {
    // First, try to update the existing 'latest' document
    await setDoc(doc(db, "restaurant-analysis", "latest"), {
      timestamp: new Date(),
      data: data
    });
    
    // Then, also add a new document with timestamp for history
    await addDoc(collection(db, "restaurant-analysis-history"), {
      timestamp: new Date(),
      data: data
    });
    
    console.log("Analysis saved to Firestore");
    return true;
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    return false;
  }
};

export const analyzeRestaurants = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Sample reviews - replace with your actual data source
    const sampleReviews = [
      {
        "restaurantName": "Grill House Supreme",
        "rating": 4.5,
        "textReviews": "Ogromne porcje, duże dania wielkości talerza. Super stosunek jakości do ceny. Solidne porcje, pełno dodatków.",
        "averagePrice": 45
      },
      {
        "restaurantName": "Tiny Tastes Bistro",
        "rating": 2.5,
        "textReviews": "Mikroskopijne porcje, za małe jak na tę cenę. Tak mało jedzenia, że nadal byłem głodny. Porcje na trzy widelce, wielkość porcji rozczarowuje.",
        "averagePrice": 30
      }
    ];
    
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
       Provide your analysis in the following JSON format only, without any markdown, comments, or additional text:
       {
         "analysisResults": [
           {
             "restaurantName": "Restaurant Name",
             "compareFun": 0.0,
             "aiComment": "Comment" 
           }
         ]
       }
       
       The aiComment should be in Polish and standardized according to the compareFun score:
       - If compareFun is above 0.8, say "Najesz sie niewielkim kosztem"
       - If compareFun is between 0.5 and 0.8, say "Mogłoby być lepiej"
       - If compareFun is below 0.5, say "Dużo wydasz i sie nie najesz"
    
    IMPORTANT: Return ONLY the JSON object, no markdown formatting (no \`\`\`json or \`\`\`python), no explanations before or after.
    
    JSON Data:
    ${JSON.stringify(sampleReviews, null, 2)}
    `;
    
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const outputText = await response.text();

        // Improved cleaning: Remove any markdown formatting regardless of language
        let cleanOutput = outputText
            .replace(/^```(?:json|python|javascript)?\s*/m, '')  // remove starting markdown
            .replace(/```$/m, '')                             // remove trailing markdown
            .trim();                                          // trim whitespace
        
        // If the output still starts with a non-JSON character, find the first '{' and start from there
        if (cleanOutput.charAt(0) !== '{') {
            const jsonStart = cleanOutput.indexOf('{');
            if (jsonStart >= 0) {
                cleanOutput = cleanOutput.substring(jsonStart);
            }
        }
        
        // Parse the cleaned output to ensure it's valid JSON
        const parsedOutput = JSON.parse(cleanOutput);
        
        // Store in localStorage
        localStorage.setItem('geminiData', JSON.stringify(parsedOutput));
        
        // Save to Firestore
        await saveToFirestore(parsedOutput);
        
        // Return a readable version of the data
        return JSON.stringify(parsedOutput, null, 2);
    } catch (error) {
        console.error('Error analyzing restaurants:', error);
        throw error;
    }
}; 