import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { Building2, CalendarDays } from "lucide-react";
 import { api } from "../api/axiosClient";
import "../components/homepage/ViewWall.css";

const ViewWall = () => {
  const [wall, setWall] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadWall();
  }, []);

  const loadWall = async () => {
    try {
      const response = await api.get("/wall");
      setWall(response.data?.["wall-posts"] || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="">

      <div className="feed-header">

       

        <h5>Wall Posts</h5>

      </div>

      {wall.map((post) => (
        <div
          key={post.post_id}
          className="feed-post-card"
        >

          {post.images?.length > 0 && (
            <div className="feed-post-image-wrap">

              <img
                src={post.images[0]?.images}
                className="feed-post-image"
                alt=""
                onClick={() => {
                  setSelectedImage(
                    post.images[0]?.images
                  );
                  setShowImage(true);
                }}
              />

              <span className="feed-post-badge">
                {post.post_type}
              </span>

              <div className="feed-post-overlay">
                <h3>{post.employee_name}</h3>
              </div>

            </div>
          )}

          <div className="feed-post-content">

            <div
              dangerouslySetInnerHTML={{
                __html: post.text
              }}
            />

            <div className="feed-post-footer">

              <div className="feed-post-author">
                <Building2 size={14} />
                {post.emp_designation}
              </div>

              <div className="feed-post-date">
                <CalendarDays size={14} />
                {post.date}
              </div>

            </div>

          </div>

        </div>
      ))}

      <Modal
        show={showImage}
        onHide={() => setShowImage(false)}
        centered
        size="lg"
      >
        <Modal.Body>
          <img
            src={selectedImage}
            alt=""
            style={{
              width: "100%"
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewWall;