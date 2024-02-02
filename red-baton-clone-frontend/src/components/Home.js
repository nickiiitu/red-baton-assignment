import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import crawlHackerNews from "../../../controllers/crawl";
const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
    // const arr = crawlHackerNews();
    // console.log(arr);
  }, []);

  const [data, setData] = useState({
    title: "",
    desc: "",
  });
  const [error, setError] = useState("");
  const [notes, setNotes] = useState([]);
  const noteRef = useRef(null);

  const handleChange = (e) => {
    setError("");
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const getNotes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notes/${user._id}`
      );

      if (res.data) {
        setNotes(res.data);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.title === "") {
      setError("Title can't be empty");
    } else if (data.desc === "") {
      setError("Desc can't be empty");
    } else {
      try {
        const res = await axios.post("http://localhost:5000/api/notes", {
          ...data,
          id: user._id,
        });
        if (res.data) {
          getNotes();
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setData({
          title: "",
          desc: "",
        });
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleDelete = async (e) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/notes/${e._id}`
      );
      if (res.data) {
        getNotes();
      }
    } catch (error) {}
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
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-content">
        <div className="py-2 font-semibold px-2">
          <p className="text-title">1 . Ask HN: Looking for a Cofounder?</p>
          <p className="mt-1 ps-4 font-thin text-sub ">
            {" "}
            1 point by karanveer 1 minute ago | hide | past | discuss
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
