import { useRecoilState, useSetRecoilState } from "recoil";
import { publicPlaylistsAtom, userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const useProfile = () => {
  const [user, setUser] = useRecoilState(userState);
  const setPublicPlaylists = useSetRecoilState(publicPlaylistsAtom);

  const getUserProfile = (handle) => {
    axiosInstance
      .get(`/users/${handle}`)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("handle", res.data.username);
          setUser({
            ...user,
            displayName: res.data?.display_name,
            username: res.data?.username,
            image: res.data.image_url,
            traits: res.data.traits,
            anthem: res.data.anthem,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUserPublicPlaylists = (username) => {
    axiosInstance
      .get(`/playlists/${username}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data !== "No playlists!") {
            console.log(res.data);
            setPublicPlaylists(res.data);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getUserProfile, getUserPublicPlaylists };
};

export default useProfile;
