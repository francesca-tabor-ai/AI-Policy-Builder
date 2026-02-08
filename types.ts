
export enum PolicyType {
  DIALOGUE = 'Dialogue',
  SAFETY = 'Safety & Content',
  BEHAVIORAL = 'Behavioral',
  BUSINESS = 'Business Rules',
  PRIVACY = 'Data & Privacy',
  ESCALATION = 'Escalation'
}

export enum PolicyStatus {
  DRAFT = 'Draft',
  REVIEW = 'In Review',
  APPROVED = 'Approved'
}

export interface Rule {
  id: string;
  trigger: string;
  allowedActions: string[];
  disallowedActions: string[];
  requiredResponse: string;
  priority: number;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  type: PolicyType;
  domain: string;
  status: PolicyStatus;
  version: string;
  lastUpdated: string;
  author: string;
  rules: Rule[];
}

export interface Product {
  id: string;
  name: string;
  type: 'Web Application' | 'Native Mobile';
  rawPrd: string;
  extractedFeatures: string[];
  targetAudience: string;
  status: 'active' | 'maintenance' | 'draft';
  traffic?: string;
}

export interface ExtractionResult {
  extractedFeatures: string[];
  targetAudience: string;
  suggestedPolicies: Partial<Policy>[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface TestScenario {
  id: string;
  name: string;
  userInput: string;
  expectedOutcome: string;
  pass?: boolean;
}
