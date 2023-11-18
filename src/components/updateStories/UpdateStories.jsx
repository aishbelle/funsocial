import "./updateStories.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
const UpdateStories = ({ setOpenUpdate, user }) => {
  const [file, setFile] = useState(null);

  const upload = async (file) =>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);

  // Get download URL
    const url = await getDownloadURL(storageRef);
    return url;
  }
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (story)=>{
      return makeRequest.post("/stories", story);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload(file);
    mutation.mutate({ img: imgUrl });
    setOpenUpdate(false);
    setFile(null);
  };

  return (
    <div className="updateStories">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={user.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${user.name}?`}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
            <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStories;