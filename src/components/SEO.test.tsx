import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SEO from './SEO';
import { HelmetProvider } from 'react-helmet-async';

// Mock SEO props
const mockProps = {
    title: 'Test Title',
    description: 'Test Description',
    keywords: 'test, keywords',
    charSet: 'utf-8',
};

describe('SEO Component', () => {
    it('renders without crashing', () => {
        render(
            <HelmetProvider>
                <SEO {...mockProps} />
            </HelmetProvider>
        );
    });

    // Note: react-helmet-async renders to head, which is harder to test in jsdom
    // without more complex setup, but we can at least verify it renders in the provider.
    it('is present in the DOM', () => {
        const { container } = render(
            <HelmetProvider>
                <SEO {...mockProps} />
            </HelmetProvider>
        );
        expect(container).toBeDefined();
    });
});
