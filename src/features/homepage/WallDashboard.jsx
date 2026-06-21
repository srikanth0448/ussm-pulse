import { useState, useEffect } from "react";
import { api } from "../../services/api/axiosClient";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import "./WallDashboard.css";
import { ChevronRight } from "lucide-react";
import Loader from "../../components/common/Loader";

const WallDashboard = () => {
  const [wall, setWall] = useState([]);
  const [index, setIndex] = useState(0);

  const wallDetails = async () => {
    try {
      const response = await api.get("/wall");

      if (response.data?.status) {
        setWall(response.data?.["wall-posts"] || []);
      }
    } catch (error) {
      console.error(error);
      setWall([]);
    }
  };

  useEffect(() => {
    wallDetails();
  }, []);

  return (
    <div className="dashboard-wall">
      <div className="dashboard-wall-header">
        <h5>Wall Posts</h5>

        <Link to="/viewwallpage" className="dashboard-view-all">
          View All
          <ChevronRight size={15} />
        </Link>
      </div>

      {wall.length > 0 ? (
        <Carousel
          activeIndex={index}
          onSelect={(i) => setIndex(i)}
          interval={4000}
          controls={false}
          fade
        >
          {wall.map((item) => (
            <Carousel.Item key={item.post_id}>
              <div className="dashboard-card">
                <div className="dashboard-image-wrap">
                  <img
                    src={item.images?.[0]?.images}
                    className="dashboard-image"
                    alt=""
                  />

                  <span className="dashboard-badge">{item.post_type}</span>

                  <div className="dashboard-overlay">
                    <h3>{item.employee_name}</h3>
                  </div>
                </div>

                <div className="dashboard-content">
                  <div
                    className="dashboard-desc"
                    dangerouslySetInnerHTML={{
                      __html: item.text,
                    }}
                  />

                  <div className="dashboard-footer">
                    <div className="dashboard-author">
                      🏢 {item.emp_designation}
                    </div>

                    <div className="dashboard-date">{item.date}</div>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default WallDashboard;
