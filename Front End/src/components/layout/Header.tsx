"use client";

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import styles from './Header.module.css';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setMobileMenuOpen(false);
        }
    };

    const isActive = (path: string) => {
        if (path.startsWith('/#')) return false; // Anchor links are not "active" pages
        return pathname === path || pathname?.startsWith(path + '/');
    };

    const navLinks = [
        { href: '/', label: 'الرئيسية', exact: true },
        { href: '/category/health', label: 'المواضيع' },
        { href: '/#programs', label: 'البرامج' }, // CHANGED: Anchor Link to Section
        { href: '/#documentaries', label: 'الوثائقيات' }, // CHANGED: Anchor Link to Section
    ];

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            // Check if we are already on home page
            if (pathname === '/') {
                e.preventDefault();
                const id = href.replace('/#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                }
            } else {
                // If not on home, natural navigation to /#id will work, but we verify mobile menu closes
                setMobileMenuOpen(false);
            }
        }
    };

    return (
        <>
            <header className={styles.header}>
                <div className={`container ${styles.container}`}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        وقاية<span>+</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.nav}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.navLink} ${link.exact
                                    ? pathname === link.href ? styles.active : ''
                                    : isActive(link.href) ? styles.active : ''
                                    }`}
                                onClick={(e) => link.href.startsWith('/#') ? handleLinkClick(e, link.href) : null}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className={styles.actions}>
                        <form onSubmit={handleSearch} className={styles.searchForm}>
                            <input
                                type="text"
                                placeholder="ابحث..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchBtn}>
                                <Search size={18} strokeWidth={2} />
                            </button>
                        </form>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.open : ''}`} onClick={() => setMobileMenuOpen(false)} />

            {/* Mobile Menu Drawer */}
            <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.mobileNavLink} ${link.exact
                                ? pathname === link.href ? styles.active : ''
                                : isActive(link.href) ? styles.active : ''
                                }`}
                            onClick={(e) => {
                                setMobileMenuOpen(false);
                                if (link.href.startsWith('/#')) handleLinkClick(e, link.href);
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
                    <input
                        type="text"
                        placeholder="ابحث..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={styles.mobileSearchInput}
                    />
                    <button type="submit" className={styles.mobileSearchBtn}>
                        <Search size={20} />
                    </button>
                </form>
            </div>
        </>
    );
}
