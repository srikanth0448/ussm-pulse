import Carousel from "react-bootstrap/Carousel";
import "../../styles/Loginpage.css";
import img1 from "../../assets/resortheader02.png";
import img2 from "../../assets/resortheader.png";
import img3 from "../../assets/resortheader02.png";
import logotag from "../../assets/pulselogowhite.png";
import "bootstrap/dist/css/bootstrap.min.css";

const slides = [
  {
    // src: img1,
    src: img1,
    heading: "Build the future track the progress.",
  },
  {
    // src: img2,
    src: img2,
    heading: "Seamless task management",
  },
  {
    // src: img3,
    src: img3,
    heading: "Stay connected across all sites.",
  },
];

function ImageCarousel() {
  return (
    <div className="image-carousel">
      {/* Brand logo — sits above the carousel */}
      <div className="image-carousel__brand">
        <img src={logotag} alt="" className="image-carousel__brand-logo" />
      </div>

      <Carousel
        fade
        interval={4000}
        indicators={true}
        controls={true}
        className="image-carousel__bootstrap"
      >
        {slides.map((slide, i) => (
          <Carousel.Item key={i}>
            {/* Dark overlay so text stays readable */}
            <div className="image-carousel__overlay" />

            <img
              src={slide.src}
              alt={slide.heading}
              className="image-carousel__img"
            />

            <Carousel.Caption className="image-carousel__caption">
              <h2 className="image-carousel__heading">{slide.heading}</h2>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageCarousel;
