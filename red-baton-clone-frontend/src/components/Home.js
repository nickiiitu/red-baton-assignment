import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import crawlHackerNews from "../../../controllers/crawl";
const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  function splitArrayIntoChunks(array, chunkSize) {
    const result = Array.from(
      { length: Math.ceil(array.length / chunkSize) },
      (v, i) => array.slice(i * chunkSize, i * chunkSize + chunkSize)
    );

    return result;
  }
  const getNotes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/news/`);
      if (res?.data) {
        const chunkedArrayOfObjects = splitArrayIntoChunks(res.data, 30);
        setNotes(chunkedArrayOfObjects);
        // setNotes(res.data);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  console.log(notes);
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
            return (
              <div className="py-2 font-semibold px-2">
                <p className="text-title">
                  <a href={e.hnUrl}>
                    {" "}
                    {30 * count + i + 1} . {e.title}{" "}
                  </a>
                  (<span className="font-thin ">{e.url}</span>)
                </p>
                <p className="mt-1 ps-4 font-thin text-sub ">
                  {" "}
                  {e.upVotes} points {timeDifferenceHours} | {e.comments}{" "}
                  comments
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
        {count < notes.length && (
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
