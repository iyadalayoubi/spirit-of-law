import { clsx } from 'clsx'

/**
 * Merges class names, filtering falsy values.
 * Thin wrapper around clsx for convenience.
 *
 * Usage: cn('base-class', isActive && 'active', { 'conditional': flag })
 */
export function cn(...inputs) {
  return clsx(...inputs)
}