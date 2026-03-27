import { Tier } from '@/types';

export const TIER_CONFIG = {
  anonymous:  { dailyLimit: 2,        formats: ['csv', 'json'] as const,           insights: false, history: false },
  free:       { dailyLimit: 5,        formats: ['csv', 'json', 'excel'] as const,  insights: false, history: true },
  premium:    { dailyLimit: Infinity, formats: ['csv', 'json', 'excel'] as const,  insights: true,  history: true },
  enterprise: { dailyLimit: Infinity, formats: ['csv', 'json', 'excel'] as const,  insights: true,  history: true },
} as const;

export type ExportFormat = 'csv' | 'json' | 'excel';

export function getTierConfig(tier: Tier) {
  return TIER_CONFIG[tier];
}

export function canUseFormat(tier: Tier, format: ExportFormat): boolean {
  const config = TIER_CONFIG[tier];
  return (config.formats as readonly string[]).includes(format);
}

export function hasReachedLimit(tier: Tier, used: number): boolean {
  return used >= TIER_CONFIG[tier].dailyLimit;
}

export function getRemainingConversions(tier: Tier, used: number): number {
  const limit = TIER_CONFIG[tier].dailyLimit;
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - used);
}
