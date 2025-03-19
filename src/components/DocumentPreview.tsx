
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { exportToPdf, exportToWord } from '@/lib/exportDocument';
import { toast } from '@/hooks/use-toast';

const DocumentPreview = () => {
  const { 
    documentType, 
    projectDetails, 
    generatedContent, 
    prevStep, 
    isLoading 
  } = useDocumentStore();
  
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: 'pdf' | 'word') => {
    setIsExporting(true);
    try {
      if (format === 'pdf') {
        exportToPdf(generatedContent, projectDetails.title);
      } else {
        exportToWord(generatedContent, projectDetails.title);
      }
      toast({
        title: "Export Successful",
        description: `Your document has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Error exporting document:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting your document.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const documentTypeLabels = {
    srs: 'Software Requirements Specification',
    poc: 'Proof of Concept',
    report: 'Report Sheet'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container px-4 py-8 mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with controls */}
        <div className="md:w-64 space-y-6">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Document Info</h2>
            <div className="text-sm">
              <div className="text-muted-foreground">Type:</div>
              <div className="font-medium">
                {documentTypeLabels[documentType as keyof typeof documentTypeLabels]}
              </div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Title:</div>
              <div className="font-medium">{projectDetails.title}</div>
            </div>
          </div>
          
          <div className="space-y-3 pt-4">
            <h2 className="font-semibold text-lg">Export</h2>
            <Button 
              onClick={() => handleExport('pdf')} 
              className="w-full justify-start"
              disabled={isExporting || isLoading}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export as PDF
            </Button>
            <Button 
              onClick={() => handleExport('word')} 
              variant="outline" 
              className="w-full justify-start"
              disabled={isExporting || isLoading}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Export as Word
            </Button>
          </div>
        </div>
        
        {/* Document preview */}
        <div className="flex-1">
          <div className="bg-white paper-texture rounded-lg shadow-md p-8 min-h-[800px] max-w-4xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating your document...</p>
              </div>
            ) : (
              <div ref={contentRef} className="prose max-w-none">
                <h1 className="text-3xl font-bold mb-6">{projectDetails.title}</h1>
                <div className="whitespace-pre-line">
                  {generatedContent.split('\n').map((paragraph, idx) => {
                    // Check if the paragraph is a heading
                    if (paragraph.startsWith('#')) {
                      const level = paragraph.match(/^(#+)/)?.[0].length || 1;
                      const text = paragraph.replace(/^#+\s*/, '');
                      
                      switch (level) {
                        case 1:
                          return <h1 key={idx} className="text-2xl font-bold mt-6 mb-3">{text}</h1>;
                        case 2:
                          return <h2 key={idx} className="text-xl font-bold mt-5 mb-2">{text}</h2>;
                        case 3:
                          return <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">{text}</h3>;
                        default:
                          return <h4 key={idx} className="text-base font-medium mt-3 mb-2">{text}</h4>;
                      }
                    }
                    
                    // Regular paragraph
                    return paragraph.trim() === '' ? 
                      <br key={idx} /> : 
                      <p key={idx} className="mb-4">{paragraph}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentPreview;
