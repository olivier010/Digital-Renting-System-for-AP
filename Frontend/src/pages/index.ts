// Shared pages (accessible to all users)
export * from './shared'

// Feature page groups are exported as namespaces to avoid name collisions.
export * as renterPages from './renter'
export * as ownerPages from './owner'
export * as adminPages from './admin'
