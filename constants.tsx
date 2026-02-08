
import React from 'react';
import { Shield, MessageSquare, Briefcase, Zap, UserCheck, Lock } from 'lucide-react';
import { PolicyType, PolicyStatus, Policy } from './types';

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'p1',
    name: 'Healthcare Advice Guardrails',
    description: 'Rules for providing medical information without diagnosing.',
    type: PolicyType.SAFETY,
    domain: 'Healthcare',
    status: PolicyStatus.APPROVED,
    version: '2.1.0',
    lastUpdated: '2023-11-20',
    author: 'Dr. Sarah Smith',
    rules: [
      {
        id: 'r1',
        trigger: 'User asks for a diagnosis',
        allowedActions: ['Provide general information', 'Recommend seeing a doctor'],
        disallowedActions: ['Confirm a diagnosis', 'Prescribe medication'],
        requiredResponse: 'I am an AI, not a doctor. For specific health concerns, please consult a professional.',
        priority: 1
      },
      {
        id: 'r2',
        trigger: 'Emergency symptoms mentioned',
        allowedActions: ['Escalate immediately'],
        disallowedActions: ['Wait for more info'],
        requiredResponse: 'If you are experiencing a medical emergency, please call 911 or your local emergency services immediately.',
        priority: 1
      }
    ]
  },
  {
    id: 'p2',
    name: 'Tax Filing Assistant Rules',
    description: 'Ensuring compliance with local tax regulations.',
    type: PolicyType.BUSINESS,
    domain: 'Finance',
    status: PolicyStatus.REVIEW,
    version: '1.0.4',
    lastUpdated: '2023-12-01',
    author: 'Legal Dept',
    rules: [
      {
        id: 'r3',
        trigger: 'Inquiry about deduction limits',
        allowedActions: ['State current official limits'],
        disallowedActions: ['Suggest tax evasion loopholes'],
        requiredResponse: 'Based on current IRS guidelines, the limit for this deduction is...',
        priority: 2
      }
    ]
  },
  {
    id: 'p3',
    name: 'Standard Customer Service Tone',
    description: 'Maintaining a professional yet friendly voice across all regions.',
    type: PolicyType.BEHAVIORAL,
    domain: 'General',
    status: PolicyStatus.DRAFT,
    version: '0.9.0',
    lastUpdated: '2023-12-05',
    author: 'CX Team',
    rules: [
      {
        id: 'r4',
        trigger: 'Angry customer',
        allowedActions: ['Empathize', 'Offer solution'],
        disallowedActions: ['Argue', 'Sarcasm'],
        requiredResponse: 'I understand your frustration. Let me help resolve this as quickly as possible.',
        priority: 2
      }
    ]
  }
];

export const POLICY_TYPE_ICONS = {
  [PolicyType.DIALOGUE]: <MessageSquare className="w-5 h-5" />,
  [PolicyType.SAFETY]: <Shield className="w-5 h-5" />,
  [PolicyType.BEHAVIORAL]: <UserCheck className="w-5 h-5" />,
  [PolicyType.BUSINESS]: <Briefcase className="w-5 h-5" />,
  [PolicyType.PRIVACY]: <Lock className="w-5 h-5" />,
  [PolicyType.ESCALATION]: <Zap className="w-5 h-5" />
};
