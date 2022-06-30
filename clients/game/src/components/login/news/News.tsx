import image from '../../../assets/images/misc/news/news-15-05-2022.png';
import styles from './News.module.scss';

function News() {
    return (
        <div className={styles['news-cont']} onClick={() => { window.open('/changelog.txt', '_blank'); }}>
            <h1 className={styles['news-header']}>News</h1>
            <p className={styles['news-date']}>15/05/2022</p>
            <p className={styles['news-title']}>
                Test title
                <br />
                <br />
                Welcome to Rogueworld
            </p>
            <img className={styles['news-image']} draggable="false" src={image.src} />
        </div>
    );
}

export default News;
