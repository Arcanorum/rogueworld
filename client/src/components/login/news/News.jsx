import React from "react";
import image from "../../../assets/images/misc/news/news-01-04-2021.png";
import "./News.scss";

function News() {
    return (
        <div className="news-cont" onClick={() => { window.open("/changelog.txt", "_blank"); }}>
            <h1 className="news-header">News</h1>
            <p className="news-date">01/04/2021</p>
            <p className="news-title">
                Update 8
                <br />
                Items rework
            </p>
            <img className="news-image" draggable="false" src={image} />
        </div>
    );
}

export default News;
