export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Cryptography' | 'Network Security' | 'Web Security' | 'System Security';
  concepts: string[];
  tools: string[];
  steps: string[];
}
