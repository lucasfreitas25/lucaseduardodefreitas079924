import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PhotoUpload } from './PhotoUpload';

describe('PhotoUpload Component', () => {
    // Mock global URL methods
    const originalCreateObjectURL = global.URL.createObjectURL;
    const mockCreateObjectURL = vi.fn();

    beforeEach(() => {
        global.URL.createObjectURL = mockCreateObjectURL;
        mockCreateObjectURL.mockReturnValue('blob:mock-url');
    });

    afterEach(() => {
        global.URL.createObjectURL = originalCreateObjectURL;
        vi.clearAllMocks();
    });

    it('deve renderizar corretamente sem foto inicial', () => {
        render(<PhotoUpload onPhotoSelect={() => { }} label="Sua Foto" />);

        expect(screen.getByText('Sua Foto')).toBeInTheDocument();
        expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    });

    it('deve renderizar com foto inicial se fornecida', () => {
        render(<PhotoUpload onPhotoSelect={() => { }} currentPhotoUrl="http://example.com/photo.jpg" />);

        const img = screen.getByAltText('Preview');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'http://example.com/photo.jpg');
    });

    it('deve chamar onPhotoSelect quando um arquivo é selecionado', () => {
        const handleSelect = vi.fn();
        const { container } = render(<PhotoUpload onPhotoSelect={handleSelect} />);

        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
        const input = container.querySelector('input[type="file"]');

        fireEvent.change(input!, { target: { files: [file] } });

        expect(handleSelect).toHaveBeenCalledWith(file);
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });

    it('deve permitir remover a foto', () => {
        const handleSelect = vi.fn();
        const handleDelete = vi.fn(); // Optional prop

        render(
            <PhotoUpload
                onPhotoSelect={handleSelect}
                currentPhotoUrl="http://example.com/existing.jpg"
                onPhotoDelete={handleDelete}
            />
        );

        // Verifica se botão de remover existe
        const removeButton = screen.getByRole('button', { name: /remover foto/i });
        fireEvent.click(removeButton);

        expect(handleSelect).toHaveBeenCalledWith(null);
        expect(handleDelete).toHaveBeenCalled();
        expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    });
});
