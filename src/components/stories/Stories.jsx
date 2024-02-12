import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import UpdateStories from "../../components/updateStories/UpdateStories";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res)=>{
      return res.data;
    }),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (storyId)=>{
      return makeRequest.delete("/stories/"+ storyId)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleDelete = (storyId) => {
    deleteMutation.mutate(storyId);
  };
  //TODO Add story using react-query mutations and use upload function.

  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={() => setOpenUpdate(true)}>+</button>
        {openUpdate && <UpdateStories setOpenUpdate={setOpenUpdate} user={currentUser} />}
      </div>
    </div>
    //placed above last div
  );
};

export default Stories;
/*{error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data ? data.map((story) => (
            <div className="story" key={story.id}>
              <img src={story.img} alt="" />
              <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && story.userId === currentUser.id && (
            <button className="del" onClick={() => handleDelete(story.id)}>delete</button>
          )}
              <span>{story.name}</span>
            </div>
          )): "No data"}*/