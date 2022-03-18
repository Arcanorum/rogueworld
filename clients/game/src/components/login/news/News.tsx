import image from '../../../assets/images/misc/news/news-05-09-2021.png';
import styles from './News.module.scss';

function News() {
    return (
        <div className={styles['news-cont']} onClick={() => { window.open('/changelog.txt', '_blank'); }}>
            <h1 className={styles['news-header']}>News</h1>
            <p className={styles['news-date']}>05/09/2021</p>
            <p className={styles['news-title']}>
                Update 12
                <br />
                Craftable relics
            </p>
            <img className={styles['news-image']} draggable="false" src={image.src} />
        </div>
    );
}

export default News;
