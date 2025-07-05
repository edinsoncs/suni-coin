import type { NextApiRequest, NextApiResponse } from 'next'
import execute from '@/src/vm/index.js'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const { script, state, debug } = req.body
    const result = execute(script, state, Boolean(debug))
    res.status(200).json(result)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
}
