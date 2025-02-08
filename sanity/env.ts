export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-07'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  "skmdrJ4o1eK7TsQMpC0sp1b3VQ6KGCJcLeeEoaql32t8uME8l8G71znRRtkmj3ZHccCGQus524gNojqpNsXFALKkEqNl4xylWfQM24IdAKc0Z2loQNRu1cvRvyutBk5hOSC579DDQSz1HiSn49DNG6tLo4eD2HB1CCGfnkJ0PzXvQfC6HrrL",
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
export const token = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
