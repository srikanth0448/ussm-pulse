import ImageCarousel from "../components/Loginpage/ImageCarousel";
import LoginForm from "../components/Loginpage/LoginForm";
import "../styles/Loginpage.css";
function LoginPage() {
  return (
    <div className="login-page p-lg-5 p-0">
      <div className="login-page__card">
        {/* Left — image carousel */}
        <div className="login-page__left">
          <ImageCarousel />
        </div>

        {/* Right — login form */}
        <div className=" login-page__right p-lg-3 p-0 pt-1 ">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
