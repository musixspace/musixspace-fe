import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import useDebounceCallback from "../../hooks/useDebounce";
import { axiosInstance } from "../../util/axiosConfig";
import logo from "../../assets/images/logo-black.png";

const AddSongModal = ({ title, submitData, close, type }) => {
  const [search, setSearch] = useState({
    id: null,
    name: "",
    image_url: null,
  });

  const [itemList, setItemList] = useState(null);

  const apiCall = useDebounceCallback((value) => {
    axiosInstance
      .post("/search", { query: value, type: type })
      .then((res) => {
        setItemList(res.data);
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
              placeholder={type === "track" ? "Search song" : "Search artist"}
            />
            <IoMdClose
              onClick={() => setSearch({ ...search, id: null, name: "" })}
            />
          </div>
          <ul className="song-list">
            {itemList && itemList.length
              ? itemList.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSearch({
                        ...search,
                        id: item.id,
                        name: item.name,
                        image_url: item.image_url,
                      });
                      setItemList([]);
                    }}
                  >
                    <div className="image-container">
                      <img src={item.image_url || logo} alt={item.name} />
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
