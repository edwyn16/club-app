/**
 * Represents a validated tenant context.
 *
 * This type describes the tenant identity available
 * after successful authentication and authorization.
 *
 * It does not perform authorization itself.
 */
export interface TenantContext {
    clubId: string;
    userId: string;
}

/**
 * Represents a request with an established tenant
 * context.
 *
 * TenantContext must only be constructed after
 * validating the user's membership and permissions
 * for the requested club.
 */
export interface TenantScopedRequest {
    tenant: TenantContext;
}
