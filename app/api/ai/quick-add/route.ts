import { NextResponse } from 'next/server'
import { openai, calculateCost, addToSpending, isWithinBudget } from '@/lib/ai/openai-client'

export const runtime = 'nodejs'

interface QuickAddRequest {
  itemName: string
  recipientContext?: string // Optional: "Mom, age 55, likes gardening"
}

export async function POST(request: Request) {
  try {
    // Check budget before making API call
    if (!isWithinBudget()) {
      return NextResponse.json(
        { error: 'AI budget limit reached ($10 cap). Please contact support.' },
        { status: 429 }
      )
    }

    const body: QuickAddRequest = await request.json()
    const { itemName, recipientContext } = body

    if (!itemName || itemName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      )
    }

    const prompt = recipientContext
      ? `You are a helpful shopping assistant. A user wants to buy "${itemName}" for ${recipientContext}.

Find this product and provide:
1. 3-5 retailer links (Amazon, Walmart, Target, Best Buy, etc.) with estimated prices
2. A brief description of the product
3. Suggested price range

Format your response as valid JSON with this structure:
{
  "description": "Brief product description",
  "priceRange": { "low": number, "high": number },
  "retailers": [
    {
      "storeName": "Amazon",
      "url": "https://amazon.com/...",
      "price": number,
      "isBestPrice": boolean,
      "isHighend": boolean
    }
  ]
}

Important:
- Provide REAL product URLs if you know them, or educational/example URLs
- Set isBestPrice: true for the lowest price
- Set isHighend: true for premium options
- Price range should be realistic for this product type`
      : `You are a helpful shopping assistant. A user wants to buy "${itemName}".

Find this product and provide:
1. 3-5 retailer links (Amazon, Walmart, Target, Best Buy, etc.) with estimated prices
2. A brief description of the product
3. Suggested price range

Format your response as valid JSON with this structure:
{
  "description": "Brief product description",
  "priceRange": { "low": number, "high": number },
  "retailers": [
    {
      "storeName": "Amazon",
      "url": "https://amazon.com/...",
      "price": number,
      "isBestPrice": boolean,
      "isHighend": boolean
    }
  ]
}

Important:
- Provide REAL product URLs if you know them, or educational/example URLs
- Set isBestPrice: true for the lowest price
- Set isHighend: true for premium options
- Price range should be realistic for this product type`

    // Call OpenAI with token cap
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful shopping assistant that finds products and provides retailer links with prices. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000, // Cap to control costs
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    // Track token usage and cost
    if (completion.usage) {
      const cost = calculateCost(completion.usage)
      addToSpending(cost)

      console.log(`AI Quick Add: ${completion.usage.total_tokens} tokens, $${cost.toFixed(4)}`)
    }

    const content = completion.choices[0].message.content
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    const result = JSON.parse(content)

    return NextResponse.json({
      success: true,
      data: result,
      usage: completion.usage,
    })
  } catch (error) {
    console.error('AI Quick Add error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    )
  }
}
