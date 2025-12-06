import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Token usage tracking (to stay under $10 budget)
export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost: number
}

// GPT-4 Turbo pricing: $0.01 per 1K prompt tokens, $0.03 per 1K completion tokens
export function calculateCost(usage: { prompt_tokens: number; completion_tokens: number }): number {
  const promptCost = (usage.prompt_tokens / 1000) * 0.01
  const completionCost = (usage.completion_tokens / 1000) * 0.03
  return promptCost + completionCost
}

// Track total spending (in production, this should be in a database)
let totalSpending = 0

export function getTotalSpending(): number {
  return totalSpending
}

export function addToSpending(cost: number): void {
  totalSpending += cost
}

export function isWithinBudget(): boolean {
  return totalSpending < 10 // $10 budget cap
}

export function getRemainingBudget(): number {
  return Math.max(0, 10 - totalSpending)
}
