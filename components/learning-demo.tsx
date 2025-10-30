'use client';

import { BookOpen, Keyboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LearningDemo() {
  return (
    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            🎓 Guided Learning Feature Demo
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            Try our new contextual learning feature! When you're chatting about complex topics, 
            simply highlight any term you don't understand and press:
          </p>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <Keyboard className="h-3 w-3 mr-1" />
              Ctrl + Shift + E
            </Badge>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              to open a focused subchat
            </span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            <strong>Example:</strong> Ask about "machine learning" and then highlight "neural networks" 
            to dive deeper into that specific concept!
          </div>
          <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900 rounded text-xs">
            <strong>Try this prompt:</strong><br/>
            "Explain machine learning with a Python code example"
          </div>
        </div>
      </div>
    </div>
  );
}
