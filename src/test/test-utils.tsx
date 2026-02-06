import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

const AllTheProviders = ({ children, initialEntries }: { children: React.ReactNode, initialEntries: string[] }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={initialEntries}>
                {children}
            </MemoryRouter>
        </QueryClientProvider>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & { route?: string },
) => {
    const route = options?.route || '/';
    return render(ui, {
        wrapper: (props) => <AllTheProviders {...props} initialEntries={[route]} />,
        ...options,
    });
};

export * from '@testing-library/react';
export { customRender as render };
