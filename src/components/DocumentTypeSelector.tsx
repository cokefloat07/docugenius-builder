import { useEffect } from 'react';
import { FileText, FilePlus, FileBarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentStore, DocumentType } from '@/store/documentStore';

const DocumentTypeSelector = () => {
  const { setDocumentType, nextStep } = useDocumentStore();

  const documentTypes = [
    {
      id: 'srs',
      title: 'Software Requirements Specification',
      description: 'Detailed documentation of software requirements and specifications.',
      icon: FileText,
    },
    {
      id: 'poc',
      title: 'Proof of Concept',
      description: 'Document demonstrating the feasibility of a concept or idea.',
      icon: FilePlus,
    },
    {
      id: 'report',
      title: 'Report Sheet',
      description: 'Comprehensive report of findings, analysis, and recommendations.',
      icon: FileBarChart,
    },
  ];

  const handleTypeSelection = (type: DocumentType) => {
    setDocumentType(type);
    nextStep();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <div className="mb-2 text-sm text-primary font-medium">GET STARTED</div>
        <h1 className="h1 mb-3">Choose Your Document Type</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-balance">
          Select the type of document you want to generate based on your project needs.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-6"
      >
        {documentTypes.map((type) => (
          <motion.div key={type.id} variants={item}>
            <Card 
              className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md cursor-pointer overflow-hidden"
              onClick={() => handleTypeSelection(type.id as DocumentType)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="pb-2">
                <type.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {type.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-primary font-medium">Select</div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DocumentTypeSelector;
