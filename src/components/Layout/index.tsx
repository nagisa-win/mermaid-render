import { ComponentChildren } from 'preact';

interface LayoutProps {
    children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
    return <div class="layout">{children}</div>;
}
