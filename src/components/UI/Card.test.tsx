import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { describe, it, expect } from 'vitest';

describe('Card Component', () => {
    it('deve renderizar título e subtítulo', () => {
        render(<Card title="Test Pet" subtitle="Dog • 2 years" />);

        expect(screen.getByText('Test Pet')).toBeDefined();
        expect(screen.getByText('Dog • 2 years')).toBeDefined();
    });

    it('deve renderizar conteúdo filho', () => {
        render(
            <Card title="Test">
                <button>Adopt Me</button>
            </Card>
        );

        expect(screen.getByRole('button', { name: /adopt me/i })).toBeDefined();
    });

    it('deve renderizar imagem quando fornecida', () => {
        render(<Card title="Test" image="https://example.com/dog.jpg" />);

        const img = screen.getByRole('img');
        expect(img).toBeDefined();
        expect(img.getAttribute('src')).toBe('https://example.com/dog.jpg');
        expect(img.getAttribute('alt')).toBe('Test');
    });

    it('deve aplicar className personalizado', () => {
        const { container } = render(<Card title="Test" className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
