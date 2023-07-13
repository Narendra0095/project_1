import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();
   
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      {
        navigate("/login");
      }
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            setListOfPosts(response.data.listOfPosts);
            setLikedPosts(
              response.data.likedPosts.map((like) => {
                return like.PostId;
              })
            );
          }
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setListOfPosts(
            listOfPosts.map((post) => {
              if (post.id === postId) {
                if (response.data.liked) {
                  // like
                  return { ...post, Likes: [...post.Likes, 0] };
                } else {
                  // unlike
                  const likeArray = post.Likes;
                  likeArray.pop();
                  return { ...post, Likes: likeArray };
                }
              } else {
                return post;
              }
            })
          );

          if (likedPosts.includes(postId)) {
            setLikedPosts(
              likedPosts.filter((id) => {
                return id != postId;
              })
            );
          } else {
            setLikedPosts([...likedPosts, postId]);
          }
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title"> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">
                <Link to={`profile/${value.UserId}`}>{value.username}</Link>
              </div>
              <div className="buttons">
                <ThumbUpAltRoundedIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "likeBttn" : "unlikeBttn"
                  }
                />
                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
