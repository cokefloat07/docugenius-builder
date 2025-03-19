
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown, Loader2 } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { generateDocumentContent } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

const DocumentForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const {
    documentType,
    projectDetails,
    updateProjectDetails,
    setGeneratedContent,
    prevStep,
    nextStep,
    isLoading,
    setLoading
  } = useDocumentStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const { title, description } = projectDetails;
    if (!title || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the title and description.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate API key
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to generate content.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      setLoading(true);
      
      const content = await generateDocumentContent(documentType!, projectDetails);
      setGeneratedContent(content);
      setLoading(false);
      nextStep();
    } catch (error) {
      console.error('Error generating document:', error);
      setLoading(false);
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating your document. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const documentTypeLabels = {
    srs: 'Software Requirements Specification',
    poc: 'Proof of Concept',
    report: 'Report Sheet'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="container px-4 py-8 max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={prevStep}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="h2 mb-2">Project Details</h1>
        <p className="text-muted-foreground">
          Provide information about your {documentTypeLabels[documentType as keyof typeof documentTypeLabels]} document.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="e.g. Inventory Management System"
                value={projectDetails.title}
                onChange={(e) => updateProjectDetails({ title: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project's purpose and goals"
                value={projectDetails.description}
                onChange={(e) => updateProjectDetails({ description: e.target.value })}
                className="mt-1 min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="requirements">Key Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the main requirements or features"
                value={projectDetails.requirements}
                onChange={(e) => updateProjectDetails({ requirements: e.target.value })}
                className="mt-1 min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="scope">Project Scope</Label>
              <Textarea
                id="scope"
                placeholder="Define what's included and excluded in this project"
                value={projectDetails.scope}
                onChange={(e) => updateProjectDetails({ scope: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g. Technical team, Business stakeholders"
                value={projectDetails.audience}
                onChange={(e) => updateProjectDetails({ audience: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div className="pt-2">
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get a free API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Generate Document
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default DocumentForm;
