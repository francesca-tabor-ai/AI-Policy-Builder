<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Policy Builder

AI Policy Builder is an enterprise-grade governance platform designed to bridge the gap between high-level product vision and technical AI safety execution. It serves as the "trust infrastructure" for organizations deploying conversational AI at scale.

## Core Value Proposition

The platform transforms the often-ambiguous requirements found in Product Requirements Documents (PRDs) into rigid, executable guardrails. By leveraging the Gemini 3.0 Pro reasoning engine, it automates the translation of human intent into technical logic, ensuring that AI agents remain compliant, safe, and strictly on-brand.

## Key Features

- **PRD-to-Policy Engine**: Upload unstructured requirements or feature specs. The AI automatically extracts functional features, identifies target audiences, and drafts relevant safety, dialogue, and business policies.
- **Adversarial Logic Simulation**: Before a policy ever hits production, users can stress-test it in a live sandbox. The platform generates "adversarial probes"—intelligent test prompts designed to trick the AI—to identify edge cases and logic gaps.
- **Centralized Fleet Management**: View your entire product ecosystem from a single dashboard. Monitor integration nodes across web and mobile applications, tracking real-time telemetry like compliance rates, throughput, and latency.
- **Mission-Critical Infrastructure**: Manage the full lifecycle of AI trust, from initial draft and peer review to final approval and SDK deployment. Built-in audit trails and rotation-ready API keys ensure enterprise-level security.

## Who is it for?

- **Product Managers**: To ensure AI features align with the original functional requirements.
- **Safety & Compliance Engineers**: To programmatically enforce guardrails against toxic content or hallucinations.
- **Legal Teams**: To maintain an immutable record of the rules governing AI behavior.

In short, AI Policy Builder is where product intent meets engineering precision, providing the tools necessary to build AI that users—and regulators—can trust.

---

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1y5mVFcVHnjgjGO4dXD2TFEpFZrrEGeXN

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
