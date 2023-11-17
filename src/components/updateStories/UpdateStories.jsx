import "./updateStories.scss";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
    setFile(null);
  };

  return (
    <div className="updateStories">
      <div className="wrapper">
        <h1>Upload Story</h1>
        <form>
          <div className="files">
            <label htmlFor="profile">
              <span>story image</span>
              <div className="imgContainer">
              {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button onClick={handleClick}>Upload</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default UpdateStories;