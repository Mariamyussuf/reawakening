
/**
 * File validation utilities
 */

export interface FileValidationOptions {
    maxSize?: number; // in bytes
    allowedTypes?: readonly string[];
    allowedExtensions?: readonly string[];
    minWidth?: number; // for images
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}

/**
 * Validate file type by extension
 */
export function validateFileExtension(
    filename: string,
    allowedExtensions: readonly string[]
): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
}

/**
 * Validate file MIME type
 */
export function validateMimeType(file: File, allowedTypes: readonly string[]): boolean {
    return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
}

/**
 * Validate image dimensions (basic check - would need image processing library for full validation)
 */
export async function validateImageDimensions(
    file: File,
    options: { minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number }
): Promise<boolean> {
    // For now, just check if it's an image type
    // Full dimension validation would require loading the image
    if (!file.type.startsWith('image/')) {
        return false;
    }

    // TODO: Implement actual dimension checking using sharp or similar
    // This would require reading the file and checking dimensions
    return true;
}

/**
 * Validate file content by checking magic bytes (file signature)
 * This helps prevent file type spoofing
 */
export async function validateFileContent(file: File, expectedMimeType: string): Promise<boolean> {
    // Read first few bytes to check magic numbers
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer.slice(0, 12));

    // Common file signatures
    const signatures: Record<string, number[][]> = {
        'image/jpeg': [[0xff, 0xd8, 0xff]],
        'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
        'image/webp': [[0x52, 0x49, 0x46, 0x46], [0x57, 0x45, 0x42, 0x50]],
        'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
    };

    const expectedSignature = signatures[expectedMimeType];
    if (!expectedSignature) {
        // If we don't have a signature for this type, just check MIME type
        return file.type === expectedMimeType;
    }

    // Check if file starts with expected signature
    return expectedSignature.some((signature) => {
        return signature.every((byte, index) => bytes[index] === byte);
    });
}

/**
 * Comprehensive file validation
 */
export async function validateFile(
    file: File | null,
    options: FileValidationOptions
): Promise<{ valid: boolean; error?: string }> {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    // Validate file size
    if (options.maxSize && !validateFileSize(file, options.maxSize)) {
        const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
        return {
            valid: false,
            error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
        };
    }

    // Validate MIME type
    if (options.allowedTypes && !validateMimeType(file, options.allowedTypes)) {
        return {
            valid: false,
            error: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`,
        };
    }

    // Validate file extension
    if (options.allowedExtensions && !validateFileExtension(file.name, options.allowedExtensions)) {
        return {
            valid: false,
            error: `File extension not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`,
        };
    }

    // Validate file content (magic bytes)
    if (options.allowedTypes && options.allowedTypes.length > 0) {
        const contentValid = await validateFileContent(file, options.allowedTypes[0]);
        if (!contentValid) {
            return {
                valid: false,
                error: 'File content does not match declared file type',
            };
        }
    }

    // Validate image dimensions if it's an image
    if (file.type.startsWith('image/')) {
        const dimensionsValid = await validateImageDimensions(file, {
            minWidth: options.minWidth,
            maxWidth: options.maxWidth,
            minHeight: options.minHeight,
            maxHeight: options.maxHeight,
        });

        if (!dimensionsValid) {
            return {
                valid: false,
                error: 'Image dimensions are invalid',
            };
        }
    }

    return { valid: true };
}

/**
 * Predefined validation options for common file types
 */
export const FileValidationPresets = {
    image: {
        maxSize: 5 * 1024 * 1024, // 5 MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    },
    pdf: {
        maxSize: 50 * 1024 * 1024, // 50 MB
        allowedTypes: ['application/pdf'],
        allowedExtensions: ['pdf'],
    },
    coverImage: {
        maxSize: 5 * 1024 * 1024, // 5 MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
        minWidth: 100,
        maxWidth: 5000,
        minHeight: 100,
        maxHeight: 5000,
    },
} as const;
