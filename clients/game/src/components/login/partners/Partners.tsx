// import theirLogo from '../../../assets/images/misc/branding/their-logo.png';
import styles from './Partners.module.scss';

function Partners({ toggleShowPartners }: { toggleShowPartners: () => void }) {
    return (
        <div className={`${styles['partners-cont']} 'press-start-font'`} onMouseLeave={toggleShowPartners}>
            <div className={styles.close} onClick={toggleShowPartners}>x</div>
            <div className={styles.header}>Thanks to our partners</div>
            <a href="http://their.domain/" rel="noreferrer" target="_blank">
                {/* <img className={styles['their-logo']} src={theirLogo.src} /> */}
            </a>
        </div>
    );
}

export default Partners;
