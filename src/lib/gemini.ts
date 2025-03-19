
import { GoogleGenerativeAI } from '@google/generative-ai';

// Using the provided API key
const apiKey = 'AIzaSyAjbFZfj9vHVFr5AEml4eejHirKaA5VTBw';

// Initialize the Gemini API with the provided key
const genAI = new GoogleGenerativeAI(apiKey);

export const generateDocumentContent = async (
  documentType: string,
  projectDetails: {
    title: string;
    description: string;
    requirements: string;
    scope: string;
    audience: string;
  }
) => {
  try {
    // Update to use the correct model name - the console error shows 'gemini-pro' isn't available in v1beta
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Create a prompt based on document type and project details
    const prompt = createPromptForDocumentType(documentType, projectDetails);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw error;
  }
};

const createPromptForDocumentType = (
  documentType: string,
  projectDetails: {
    title: string;
    description: string;
    requirements: string;
    scope: string;
    audience: string;
  }
) => {
  const { title, description, requirements, scope, audience } = projectDetails;
  
  const basePrompt = `
  Please generate a professional, well-structured ${documentType.toUpperCase()} document for the following software project:
  
  Title: ${title}
  Description: ${description}
  Requirements: ${requirements}
  Scope: ${scope}
  Target Audience: ${audience}
  `;
  
  switch (documentType) {
    case 'srs':
      return `${basePrompt}
      
      The Software Requirements Specification (SRS) should include:
      1. Introduction (purpose, scope, definitions)
      2. Overall description (product perspective, functions, user characteristics)
      3. Specific requirements (functional, non-functional, interface requirements)
      4. System features and requirements
      5. Other non-functional requirements (performance, safety, security)
      
      Organize the document with clear sections, subsections, and formatting.`;
      
    case 'poc':
      return `${basePrompt}
      
      The Proof of Concept (POC) document should include:
      1. Executive summary
      2. Business goals and objectives
      3. Technical approach and methodology
      4. Implementation plan and architecture
      5. Success criteria and metrics
      6. Risk assessment and mitigation
      7. Conclusion and recommendations
      
      Focus on demonstrating technical feasibility and business value.`;
      
    case 'report':
      return `${basePrompt}
      
      The Report Sheet should include:
      1. Executive summary
      2. Project overview and objectives
      3. Methodology and approach
      4. Findings and analysis
      5. Recommendations
      6. Conclusions
      7. Appendices (if necessary)
      
      Present the information in a clear, concise, and professional manner.`;
      
    default:
      return basePrompt;
  }
};
