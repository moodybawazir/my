import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStorage } from './useStorage';
import { supabase } from '../lib/supabase';

// Mock supabase
vi.mock('../lib/supabase', () => ({
    supabase: {
        storage: {
            from: vi.fn(() => ({
                upload: vi.fn(),
                getPublicUrl: vi.fn(),
            })),
        },
    },
}));

describe('useStorage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => useStorage());
        expect(result.current.uploading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should upload an image and return public URL', async () => {
        const mockPublicUrl = 'https://example.com/image.jpg';
        const mockUpload = vi.fn().mockResolvedValue({ data: { path: 'path' }, error: null });
        const mockGetPublicUrl = vi.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } });

        (supabase.storage.from as any).mockReturnValue({
            upload: mockUpload,
            getPublicUrl: mockGetPublicUrl,
        });

        const { result } = renderHook(() => useStorage());
        const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

        let url;
        await act(async () => {
            url = await result.current.uploadImage(file);
        });

        expect(url).toBe(mockPublicUrl);
        expect(result.current.uploading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(mockUpload).toHaveBeenCalled();
    });

    it('should handle upload error', async () => {
        const mockError = { message: 'Upload failed' };
        const mockUpload = vi.fn().mockResolvedValue({ data: null, error: mockError });

        (supabase.storage.from as any).mockReturnValue({
            upload: mockUpload,
            getPublicUrl: vi.fn(),
        });

        const { result } = renderHook(() => useStorage());
        const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

        let url;
        await act(async () => {
            url = await result.current.uploadImage(file);
        });

        expect(url).toBe(null);
        expect(result.current.uploading).toBe(false);
        expect(result.current.error).toBe(mockError.message);
    });
});
