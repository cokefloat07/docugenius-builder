
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocumentStore } from '@/store/documentStore';
import DocumentTypeSelector from '@/components/DocumentTypeSelector';
import DocumentForm from '@/components/DocumentForm';
import DocumentPreview from '@/components/DocumentPreview';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { currentStep } = useDocumentStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/30">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="type-selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentTypeSelector />
            </motion.div>
          )}
          
          {currentStep === 1 && (
            <motion.div
              key="document-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentForm />
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              key="document-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DocumentPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2023 DocuGenius. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
