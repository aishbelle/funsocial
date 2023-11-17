import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import UpdateStories from "../../components/updateStories/UpdateStories";
const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [openUpdate, setOpenUpdate] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res)=>{
      return res.data;
    }),
  });
  //TODO Add story using react-query mutations and use upload function.

  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={() => setOpenUpdate(true)}>+</button>
        {openUpdate && <UpdateStories setOpenUpdate={setOpenUpdate} user={currentUser} />}
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((story) => (
            <div className="story" key={story.id}>
              <img src={story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
  );
};

export default Stories;