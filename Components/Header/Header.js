import styles from './Header.module.scss'
const Header = () => {
    return (
        <header className={styles.header}>
            <div className="common-wrapper">
                <h1 className={styles.title}>ONE MORE WORD</h1>
                <ul className={styles.nav}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </div>
        </header>
    )
}

export default Header;