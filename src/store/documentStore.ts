
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DocumentType = 'srs' | 'poc' | 'report';

export interface ProjectDetails {
  title: string;
  description: string;
  requirements: string;
  scope: string;
  audience: string;
}

interface DocumentState {
  documentType: DocumentType | null;
  projectDetails: ProjectDetails;
  generatedContent: string;
  isLoading: boolean;
  currentStep: number;
  
  // Actions
  setDocumentType: (type: DocumentType) => void;
  updateProjectDetails: (details: Partial<ProjectDetails>) => void;
  setGeneratedContent: (content: string) => void;
  setLoading: (isLoading: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetStore: () => void;
}

const initialProjectDetails: ProjectDetails = {
  title: '',
  description: '',
  requirements: '',
  scope: '',
  audience: '',
};

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documentType: null,
      projectDetails: initialProjectDetails,
      generatedContent: '',
      isLoading: false,
      currentStep: 0,
      
      setDocumentType: (type) => set({ documentType: type }),
      
      updateProjectDetails: (details) => 
        set((state) => ({ 
          projectDetails: { ...state.projectDetails, ...details } 
        })),
      
      setGeneratedContent: (content) => set({ generatedContent: content }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      
      resetStore: () => set({ 
        documentType: null,
        projectDetails: initialProjectDetails,
        generatedContent: '',
        currentStep: 0
      }),
    }),
    {
      name: 'document-storage',
    }
  )
);
