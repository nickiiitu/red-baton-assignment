import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import crawlHackerNews from "../../../controllers/crawl";
const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleUrl = (e) => {
    const temp = news.filter((k) => k.url === e.url);
    setNotes(splitArrayIntoChunks(temp, 30));
  };
  function splitArrayIntoChunks(array, chunkSize) {
    const result = Array.from(
      { length: Math.ceil(array?.length / chunkSize) },
      (v, i) => array.slice(i * chunkSize, i * chunkSize + chunkSize)
    );

    return result;
  }
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    const getAll = async () => {
      await getNotes();
      getRead();
      getHidden();
    };
    getAll();
  }, []);
  const [notes, setNotes] = useState([]);
  const [read, setRead] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [news, setNews] = useState([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const chunkedArrayOfObjects = splitArrayIntoChunks(news, 30);
    setNotes(chunkedArrayOfObjects);
  }, [news]);
  useEffect(() => {
    if (news?.length > 0 && hidden?.length > 0) {
      let temp = new Array();
      for (let i = 0; i < news?.length; i++) {
        const a1 = hidden.findIndex((val) => val.newsId === news[i]._id);
        const a2 = a1 !== -1 && hidden[a1]?.users?.includes(user._id);
        if (a1 !== -1 && a2) {
        } else {
          temp?.push(news[i]);
        }
      }
      setNews(temp);
    }
  }, [hidden]);
  const getNotes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/news/`);
      if (res?.data) {
        setNews(res?.data);
      }
    } catch (error) {}
  };
  const handleRead = async (p) => {
    const data = { newsId: p._id, userId: user._id };
    try {
      const res = await axios.post(`http://localhost:5000/api/news/read`, data);
      if (res.data) {
        getRead();
        window.open(p.hnUrl, "_black");
      }
    } catch (error) {
      console.error("Error in fetch request", error);
    }
  };

  const getRead = async () => {
    const userId = user._id;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/news/read/${userId}/`
      );
      setRead(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getHidden = async () => {
    const userId = user._id;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/news/hidden/${userId}`
      );
      setHidden(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const hide = async (p) => {
    if (user) {
      const data = { newsId: p._id, userId: user._id };
      try {
        const res = await axios.post(
          `http://localhost:5000/api/news/hidden`,
          data
        );
        if (res.data) {
          getHidden();
        }
      } catch (error) {
        console.error("Error in fetch request", error);
      }
    }
  };
  return (
    <div className="mx-10">
      {/* header */}
      <div className="header-div flex justify-between px-4 font-bold">
        <div className="text-center items-center flex ">
          <p className="text-white text-xl">Stable Money Notes Making App</p>
        </div>
        <div>
          <button
            className="border rounded font-bold my-2 mt-4 p-2 color-blue text-white"
            onClick={() => {
              if (user) {
                handleLogout();
              } else {
                navigate("/login");
              }
            }}
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>
      <div className="bg-content">
        {notes &&
          notes[count]?.length > 0 &&
          notes[count].map((e, i) => {
            const currentTime = new Date();
            const givenTimeDate = new Date(e.updatedAt);

            // Calculate the time difference in milliseconds
            const timeDifferenceMs = currentTime - givenTimeDate;
            // Convert milliseconds to hours
            let timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);
            if (timeDifferenceHours > 24) {
              timeDifferenceHours = timeDifferenceHours / 24;
              timeDifferenceHours = `${Math.round(
                timeDifferenceHours
              )} days ago`;
            } else {
              timeDifferenceHours = `${Math.round(
                timeDifferenceHours
              )} hours ago`;
            }
            let isVisited = false;
            const in2 = read.findIndex((l) => l.newsId === e._id);
            if (
              in2 !== -1 &&
              read[in2].users.findIndex((l) => l === user._id) !== -1
            ) {
              isVisited = true;
            }
            return (
              <div className="py-2 font-semibold px-2" key={30 * count + i + 1}>
                <p className={isVisited ? "text-sub" : "text-title"}>
                  <span
                    className="cursor-pointer"
                    onClick={(event) => handleRead(e)}
                  >
                    {" "}
                    {30 * count + i + 1} . {e.title}{" "}
                  </span>
                  (
                  <span
                    className="font-thin cursor-pointer"
                    onClick={() => handleUrl(e)}
                  >
                    {e.url}
                  </span>
                  )
                </p>
                <p className="mt-1 ps-4 font-thin text-sub ">
                  {" "}
                  {e.upVotes} points {timeDifferenceHours} | {e.comments}{" "}
                  comments | {isVisited && "visited"} |{" "}
                  <span className="cursor-pointer" onClick={() => hide(e)}>
                    Hide
                  </span>
                </p>
              </div>
            );
          })}
      </div>
      <div className="flex justify-center">
        {count > 0 && (
          <button
            className="border rounded font-bold my-2 mt-4 p-2 px-10 color-blue text-white"
            onClick={() => {
              setCount((prev) => prev - 1);
            }}
          >
            Prev{" "}
          </button>
        )}
        {count < notes?.length && (
          <button
            className="border rounded font-bold my-2 mt-4 p-2 px-10 color-blue text-white"
            onClick={() => {
              setCount((prev) => prev + 1);
            }}
          >
            More{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
