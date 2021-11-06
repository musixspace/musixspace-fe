import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const useProfile = () => {
  const setLoading = useSetRecoilState(loadingAtom);
  const setUser = useSetRecoilState(userState);

  const getUserProfile = (removeLoader = false) => {
    if (!removeLoader) {
      setLoading(true);
    }

    axiosInstance
      .post("/users")
      .then((res) => {
        if (res.status === 200) {
          setUser({
            displayName: res.data?.display_name,
            username: res.data?.username,
            image: res.data.image_url,
            traits: res.data.traits,
            anthem: res.data.anthem,
          });
          if (!removeLoader) {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getUserProfile };
};

export default useProfile;
