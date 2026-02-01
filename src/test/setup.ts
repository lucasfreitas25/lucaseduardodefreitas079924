import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock URL methods
if (typeof window !== 'undefined') {
    window.URL.createObjectURL = vi.fn().mockReturnValue('mock-url');
    window.URL.revokeObjectURL = vi.fn();
}

// Mock image compression utility
vi.mock('../utils/imageUtils', () => ({
    compressImage: vi.fn((file) => Promise.resolve(file)),
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
