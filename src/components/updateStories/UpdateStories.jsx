import { useState } from "react";
import { makeRequest } from "../../axios";
import "./updateStories.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../firebase";

const UpdateStories = ({ setOpenUpdate, user }) => {
  const [profile, setProfile] = useState(null);

  const upload = async (file) => {
    //console.log(file)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);

  // Get download URL
      const url = await getDownloadURL(storageRef);
      console.log(url);
      return url;
    } catch (err) {
      console.log("error uploading file:",err);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStory)=>{
      return makeRequest.post("/stories", newStory);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["story"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();

    //TODO: find a better way to get image URL
    
    try{
    let profileUrl;
    profileUrl = profile ? await upload(profile) : user.profilePic;
    
    mutation.mutate({ img: profileUrl });
    setOpenUpdate(false);
    setProfile(null);
}catch(err){
  console.log("error updating file:",err)
}
  };

  return (
    <div className="updateStories">
      <div className="wrapper">
        <h1>Upload your Story</h1>
        <form>
          <div className="files">
            <label htmlFor="profile">
              <span>What's new Today!?</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Name</label>
          <input
            type="text"
            name="name"
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};
export default UpdateStories;