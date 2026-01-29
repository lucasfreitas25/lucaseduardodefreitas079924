import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import { describe, it, expect, vi } from 'vitest';

describe('Pagination Component', () => {
    it('deve renderizar a página atual e o número total de páginas', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={() => { }}
            />
        );

        expect(screen.getByText('Página 1 de 5')).toBeDefined();
    });

    it('deve desabilitar o botão anterior na primeira página', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={5}
                onPageChange={() => { }}
            />
        );

        const prevButton = screen.getByLabelText('Página anterior');
        expect(prevButton.hasAttribute('disabled')).toBe(true);
    });

    it('deve desabilitar o botão próximo na última página', () => {
        render(
            <Pagination
                currentPage={5}
                totalPages={5}
                onPageChange={() => { }}
            />
        );

        const nextButton = screen.getByLabelText('Próxima página');
        expect(nextButton.hasAttribute('disabled')).toBe(true);
    });

    it('deve chamar onPageChange quando os botões são clicados', () => {
        const onPageChange = vi.fn();
        render(
            <Pagination
                currentPage={2}
                totalPages={5}
                onPageChange={onPageChange}
            />
        );

        fireEvent.click(screen.getByLabelText('Página anterior'));
        expect(onPageChange).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getByLabelText('Próxima página'));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('lida com zero ou páginas totais ausentes de forma graciosa', () => {
        render(
            <Pagination
                currentPage={1}
                totalPages={0}
                onPageChange={() => { }}
            />
        );

        expect(screen.getByText('Página 1 de 1')).toBeDefined();
    });
});
