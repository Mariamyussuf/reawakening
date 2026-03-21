import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';

/**
 * Validate request body against a Zod schema
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 */
export async function validateBody<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
    try {
        const body = await request.json();
        const data = schema.parse(body);
        return { success: true, data };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));

            return {
                success: false,
                response: ApiResponse.error('Validation failed', 400, { errors }),
            };
        }

        return {
            success: false,
            response: ApiResponse.error('Invalid request body', 400),
        };
    }
}

/**
 * Validate query parameters against a Zod schema
 * @param request - NextRequest object
 * @param schema - Zod schema to validate against
 * @returns Validated data or error response
 */
export function validateQuery<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
    try {
        const { searchParams } = new URL(request.url);
        const params: Record<string, string> = {};

        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        const data = schema.parse(params);
        return { success: true, data };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));

            return {
                success: false,
                response: ApiResponse.error('Invalid query parameters', 400, { errors }),
            };
        }

        return {
            success: false,
            response: ApiResponse.error('Invalid query parameters', 400),
        };
    }
}

/**
 * Validate form data (for file uploads)
 * @param formData - FormData object
 * @param schema - Zod schema to validate against (for non-file fields)
 * @returns Validated data or error response
 */
export function validateFormData<T>(
    formData: FormData,
    schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
    try {
        const data: Record<string, any> = {};

        formData.forEach((value, key) => {
            // Skip file fields
            if (value instanceof File) {
                return;
            }

            // Try to parse as JSON if it looks like JSON
            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                try {
                    data[key] = JSON.parse(value);
                } catch {
                    data[key] = value;
                }
            } else {
                data[key] = value;
            }
        });

        const validated = schema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));

            return {
                success: false,
                response: ApiResponse.error('Validation failed', 400, { errors }),
            };
        }

        return {
            success: false,
            response: ApiResponse.error('Invalid form data', 400),
        };
    }
}
