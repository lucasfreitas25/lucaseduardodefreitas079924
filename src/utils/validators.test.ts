import { describe, it, expect } from 'vitest';
import { validarEmail } from './validarEmail';
import { validarCpf } from './validarCpf';
import { formatCPF } from './formatCPF';
import { formatTelefone } from './formatTelefone';

describe('Validators', () => {
    describe('validarEmail', () => {
        it('deveria retornar true para emails válidos', () => {
            expect(validarEmail('test@example.com')).toBe(true);
            expect(validarEmail('user.name@domain.co.uk')).toBe(true);
        });

        it('deveria retornar false para emails inválidos', () => {
            expect(validarEmail('invalid-email')).toBe(false);
            expect(validarEmail('@domain.com')).toBe(false);
            expect(validarEmail('test@.com')).toBe(false);
        });
    });

    describe('validarCpf', () => {
        it('deveria retornar true para CPFs válidos', () => {
            // CPFs gerados para teste
            expect(validarCpf('123.456.789-09')).toBe(true);
            expect(validarCpf('529.982.247-25')).toBe(true);
            expect(validarCpf('12345678909')).toBe(true);
        });

        it('deveria retornar false para CPFs com todos os dígitos iguais', () => {
            expect(validarCpf('000.000.000-00')).toBe(false);
            expect(validarCpf('111.111.111-11')).toBe(false);
        });

        it('deveria retornar false para CPFs inválidos', () => {
            expect(validarCpf('123.456.789-01')).toBe(false); // Dígito verificador errado
            expect(validarCpf('123.456.789-10')).toBe(false);
        });

        it('deveria retornar false para CPFs incompletos ou com formato errado', () => {
            expect(validarCpf('123.456.789')).toBe(false);
            expect(validarCpf('abc.def.ghi-jk')).toBe(false);
        });
    });
});

describe('Formatters', () => {
    describe('formatCPF', () => {
        it('deveria formatar dígitos no padrão CPF', () => {
            expect(formatCPF('12345678901')).toBe('123.456.789-01');
        });

        it('deveria lidar com dígitos parciais', () => {
            expect(formatCPF('123')).toBe('123');
            expect(formatCPF('1234')).toBe('123.4');
        });
    });

    describe('formatTelefone', () => {
        it('deveria formatar dígitos no padrão telefone', () => {
            expect(formatTelefone('11999998888')).toBe('(11) 99999-8888');
        });

        it('deveria lidar com dígitos parciais', () => {
            expect(formatTelefone('11')).toBe('11');
            expect(formatTelefone('119')).toBe('(11) 9');
        });
    });
});
