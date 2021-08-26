import React from "react";
import { useEffect, useState } from "react";
import Newsitem from "./newsItem.jsx";
import Axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from "date-fns/format";



// to convert the daypickerinput value to string and below is the standard format.

const FORMAT = "yyyy-MM-dd";

function formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
}

const formattedDate = (date) => {
    return new Date().toISOString().substring(0, 10);
}









function Content() {

    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);
    const [date, setDate] = useState(null);



    //  console.log(formattedDate);


    //acts as componentDidMount which is responsible for first render.
    useEffect(() => {

        const getArticles = async () => {
            const res = await Axios.get(`https://newsapi.org/v2/top-headlines?country=us&from=${date}&page=1&pageSize=5&apiKey=31ff968bcf534234a556cb5022e0888a`)

            setItems(res.data.articles);
            console.log("re-rendering");
            // setPage(1); 
        }

        getArticles();

    }, [date]);

    //this will get the data stored in localstorage and render on the page if the device is offline.
    //(means it loads when the actual component is not rendered)
    //this will act as componentWillmount in class based component.
    useEffect(() => {

        console.log("getting info from local storage....");

        const localStorageData = JSON.parse(localStorage.getItem("fetched-data"));

        if (localStorageData) {

            console.log("local storage has data to be loaded/....");
            setItems(localStorageData);
        }



    }, []);

    //after first render this hooks update the data into localstorage
    useEffect(() => {
        console.log("setting item in local storage");

        localStorage.setItem("fetched-data", JSON.stringify(items));

    });


    const fetchNews = async () => {

        const res = await Axios.get(`https://newsapi.org/v2/top-headlines?country=us&from=${date}&page=${page}&pageSize=5&apiKey=31ff968bcf534234a556cb5022e0888a`)

        const finalData = res.data.articles;

        return finalData;
    }


    // this is the function/method which is responsible to render the next data if there is any(from source)
    // with the help of infinite scroll component and with its props we can achieve the infinite scroll.
    const fetchData = async () => {

        const dataFromServer = await fetchNews();
        setItems([...items, ...dataFromServer]);


        //this sets the hasMore props to false only if there is no data tofetch
        if (dataFromServer.length === 0 || dataFromServer.length < 5) {
            setHasMore(false);
        }

        setPage(page + 1);
    }





    return (
        <main className="container">

            <div className="date-container">
                <label htmlFor="selectDate"><strong>Choose date:</strong> </label>
                <DayPickerInput onDayChange={(day) => setDate(formattedDate(day))} placeholder={`${dateFnsFormat(new Date(), FORMAT)}`} formatDate={formatDate}
                    format={FORMAT} />
            </div>

            <InfiniteScroll

                dataLength={items.length}
                next={fetchData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>End of articles...</b>
                    </p>
                }

            >


                {/* this maps through our items array and renders the Newsitem component*/}


                {items.map(({ title, description, url, urlToImage, publishedAt }, index) => {

                    return <Newsitem key={index} title={title} description={description} url={url} urlToImage={urlToImage} publishedAt={publishedAt} />

                })}
            </InfiniteScroll>
        </main>


    );
}

export default Content;









   // used fetch  but, i learnt that Axios has wide browser support and also some additional features like canelling requests so, used Axios 
    //             const getArticle = ()=>{

    // const res = fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=7168bdfdbf2f4258a5baef8ad8c5fb09")

    //        res.then((data)=> data.json())
    //        .then(result => console.log(result));

    //             }

    //             getArticle();