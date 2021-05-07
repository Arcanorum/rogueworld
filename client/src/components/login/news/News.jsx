import React from "react";
import image from "../../../assets/images/misc/news/news-07-05-2021.png";
import "./News.scss";

function News() {
    return (
        <div className="news-cont" onClick={() => { window.open("/changelog.txt", "_blank"); }}>
            <h1 className="news-header">News</h1>
            <p className="news-date">07/05/2021</p>
            <p className="news-title">
                Update 9
                <br />
                City redesign
            </p>
            <img className="news-image" draggable="false" src={image} />
        </div>
    );
}

export default News;
