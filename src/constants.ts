const baseUrl = import.meta.env.BASE_URL

export const routePrefix = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '')
