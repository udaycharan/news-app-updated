import React from "react";
// import  { useEffect, useState } from "react";


function Newsitem({ title, description, url, urlToImage, publishedAt }) {


    return (

        <div className="news-item-style">
            <small>published: {publishedAt.substring(0, 10)}</small>
            <img src={urlToImage} alt="news" />
            <div className="description">
                <h2>{title}</h2>
                <h5><a href={url}>{title}</a></h5>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default Newsitem;