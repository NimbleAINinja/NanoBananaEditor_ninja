import { useState, useEffect, useCallback } from 'react';

export interface PromptTemplateInfo {
  name: string;
  file: string;
}

export interface PromptTemplate {
  [key: string]: any;
}

export const usePromptTemplates = () => {
  const [templates, setTemplates] = useState<PromptTemplateInfo[]>([]);
  const [selectedTemplateContent, setSelectedTemplateContent] = useState<PromptTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplateIndex = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/prompts/index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch prompt templates index.');
        }
        const data: PromptTemplateInfo[] = await response.json();
        setTemplates(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateIndex();
  }, []);

  const loadTemplate = useCallback(async (file: string) => {
    if (!file) {
        setSelectedTemplateContent(null);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/prompts/${file}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch prompt template: ${file}`);
      }
      const data: PromptTemplate = await response.json();
      setSelectedTemplateContent(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setSelectedTemplateContent(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { templates, selectedTemplateContent, loadTemplate, isLoading, error };
};
