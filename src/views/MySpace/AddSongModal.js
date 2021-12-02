import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import useDebounceCallback from "../../hooks/useDebounce";
import { axiosInstance } from "../../util/axiosConfig";

const AddSongModal = ({ title, submitData, close }) => {
  const [search, setSearch] = useState({
    id: null,
    name: "",
    image_url: null,
  });

  const [songList, setSongList] = useState(null);

  const apiCall = useDebounceCallback((value) => {
    axiosInstance
      .post("/search", { query: value })
      .then((res) => {
        console.log(res.data);
        setSongList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000);

  useEffect(() => {
    if (!search.id && search.name) {
      apiCall(search.name);
    }
  }, [search.name]);

  return (
    <div className="modal-wrapper add-song-modal-wrapper">
      <div className="modal-container">
        <div className="close">
          <IoMdClose onClick={close} />
        </div>
        <div className="modal add-song-modal">
          <div className="title">{title}</div>
          <div className="searchbar">
            <FaSearch />
            <input
              type="text"
              value={search.name}
              onChange={(e) =>
                setSearch({ ...search, id: null, name: e.target.value })
              }
              placeholder="Search song"
            />
            <IoMdClose
              onClick={() => setSearch({ ...search, id: null, name: "" })}
            />
          </div>
          <ul className="song-list">
            {songList && songList.length
              ? songList.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSearch({
                        ...search,
                        id: item.id,
                        name: item.name,
                        image_url: item.image_url,
                      });
                      setSongList([]);
                    }}
                  >
                    <div className="image-container">
                      <img src={item.image_url} alt={item.name} />
                    </div>
                    <div className="title">{item.name}</div>
                  </li>
                ))
              : null}
          </ul>
          <div className="button-container">
            <button
              className={search.id ? "" : "hide"}
              onClick={() => submitData(search)}
            >
              {title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSongModal;
