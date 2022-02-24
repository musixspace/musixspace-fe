import React, { useEffect, useState } from "react";
import { FaMusic } from "react-icons/fa";
import { GoMail, GoPencil } from "react-icons/go";
import { useHistory, withRouter } from "react-router";
import useDebounceCallback from "../hooks/useDebounce";
import { axiosInstance } from "../util/axiosConfig";
import { useSetRecoilState } from "recoil";
import { alertAtom } from "../recoil/alertAtom";
import CustomHelmet from "../components/CustomHelmet";

const ReadyToRock = () => {
  const history = useHistory();
  const setAlert = useSetRecoilState(alertAtom);
  const [data, setData] = useState({
    email: "",
    username: "",
    anthem: {
      id: null,
      name: "",
    },
  });

  const [anthemStore, setAnthemStore] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        await axiosInstance.get("/login/second");
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const apiCall = useDebounceCallback((value) => {
    axiosInstance
      .post("/search", { query: value, type: "track" })
      .then((res) => {
        console.log(res.data);
        setAnthemStore(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000);

  useEffect(() => {
    const flag = sessionStorage.getItem("newUser");
    console.log(typeof flag);
    if (flag === "false") {
      if (localStorage.getItem("accessToken")) {
        history.push("/insights");
      } else {
        history.push("/");
      }
    }
  }, []);

  useEffect(() => {
    if (!data.anthem.id && data.anthem.name) {
      apiCall(data.anthem.name);
    }
  }, [data.anthem.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.email && data.username && data.anthem.id) {
      const payload = {
        handle: data.username,
        bio: data.anthem.id,
      };
      axiosInstance
        .post("/newstar", payload)
        .then((res) => {
          localStorage.setItem("handle", data.username);
          history.push("/rolling");
        })
        .catch((err) => {
          setAlert({
            open: true,
            type: "error",
            message: err.response.data.msg,
          });
        });
    }
  };

  return (
    <>
      <CustomHelmet
        title="Ready To Rock"
        description="Get started with your music journey"
        keywords="Ready To Rock, Sign Up"
      />
      <div className="readyToRock">
        <form className="container" onSubmit={handleSubmit}>
          <div className="title">Ready to rock your space?</div>
          <div className="input-fields">
            <div>
              <GoMail />
              <input
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                type="text"
                placeholder="Your rocking email"
              />
            </div>
            <div>
              <GoPencil />
              <input
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                type="text"
                placeholder="A cool username"
              />
            </div>
            <div>
              <FaMusic />
              <input
                value={data.anthem.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    anthem: { id: null, name: e.target.value },
                  })
                }
                type="text"
                placeholder="Your Anthem"
              />
            </div>
            {anthemStore.length > 0 && (
              <ul className="anthem-options">
                {!data.anthem.id &&
                  anthemStore.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setData({
                          ...data,
                          anthem: { id: item.id, name: item.name },
                        });
                        setAnthemStore([]);
                      }}
                    >
                      <div className="image-container">
                        <img src={item.image_url} alt={item.name} />
                      </div>
                      <span>{item.name}</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="button-div">
            <button
              type="submit"
              className={`${
                data.username && data.anthem.id && data.email ? "" : "hide"
              }`}
            >
              I'm Ready
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default withRouter(ReadyToRock);
