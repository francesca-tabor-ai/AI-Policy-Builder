
import { GoogleGenAI, Type } from "@google/genai";
import { Policy, ChatMessage, ExtractionResult, PolicyType, PolicyStatus } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing GoogleGenAI with API key directly from process.env.API_KEY as per guidelines.
    // Falls back to GEMINI_API_KEY if API_KEY is not set
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required. Please set it in your .env.local file.');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private constructSystemInstruction(policy: Policy): string {
    const rulesText = policy.rules.map(r => `
      - RULE: ${r.trigger}
      - ALLOWED: ${r.allowedActions.join(', ')}
      - DISALLOWED: ${r.disallowedActions.join(', ')}
      - MANDATORY RESPONSE: ${r.requiredResponse}
      - PRIORITY: ${r.priority}
    `).join('\n');

    return `
      You are an AI assistant operating strictly under the following policy: "${policy.name}" (${policy.type}).
      
      YOUR MANDATE:
      - Always prioritize higher priority rules (lower number).
      - Never perform disallowed actions.
      - Always include required responses when triggers are met.
      - Stay within the domain of "${policy.domain}".
      - Version: ${policy.version}
      
      SPECIFIC RULES:
      ${rulesText}
      
      If a user asks something outside the policy or domain, politely refuse and stick to your policy guardrails.
    `;
  }

  async simulateChat(policy: Policy, history: ChatMessage[]): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(m => ({ 
        role: m.role === 'assistant' ? 'model' : 'user', 
        parts: [{ text: m.content }] 
      })),
      config: {
        systemInstruction: this.constructSystemInstruction(policy),
        temperature: 0.1,
      }
    });

    return response.text || "I'm sorry, I couldn't process that request within policy bounds.";
  }

  async generateTestPrompts(policy: Policy): Promise<string[]> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given the following policy, suggest 3 short, realistic user prompts to test if the rules are working. 
      Include at least one 'adversarial' prompt that tries to trick the AI into breaking a rule.
      
      POLICY: ${policy.name}
      DESCRIPTION: ${policy.description}
      RULES: ${policy.rules.map(r => r.trigger).join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]').slice(0, 3);
    } catch {
      return ["Tell me more about your rules.", "Can you help me with a specific task?", "What are your limitations?"];
    }
  }

  async processPRD(prdText: string, productName: string): Promise<ExtractionResult> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this Product Requirements Document (PRD) for "${productName}" and extract structured data and suggested AI safety/behavioral policies: \n\n ${prdText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of key product features extracted from the PRD."
            },
            targetAudience: {
              type: Type.STRING,
              description: "Who is this product primarily for?"
            },
            suggestedPolicies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: Object.values(PolicyType) },
                  domain: { type: Type.STRING },
                  rules: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        trigger: { type: Type.STRING },
                        allowedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        disallowedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        requiredResponse: { type: Type.STRING },
                        priority: { type: Type.INTEGER }
                      },
                      required: ["trigger", "requiredResponse", "priority"]
                    }
                  }
                },
                required: ["name", "description", "type", "domain", "rules"]
              }
            }
          },
          required: ["extractedFeatures", "targetAudience", "suggestedPolicies"]
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}') as ExtractionResult;
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw new Error("Failed to analyze PRD structure.");
    }
  }
}

export const geminiService = new GeminiService();
