import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Loginpage.css";
import { api } from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";


function LoginForm() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ mobile: "", password: "" });
  const [touched, setTouched] = useState({ mobile: false, password: false });
  const { login } = useAuth();

  // --- Validation logic ---
  const validate = (name, value) => {
    if (name === "mobile") {
      if (!value) return "Mobile number is required.";
      if (!/^\d{10}$/.test(value))
        return "Enter a valid 10-digit mobile number.";
    }
    if (name === "password") {
      if (!value) return "Password is required.";
      if (value.length < 6) return "Password must be at least 6 characters.";
    }

    if (name === "Invalid Details") {
      if (value) return value; // show API error if it exists
    }
    return ""; // no error
  };

  // --- Run validation on blur (when user leaves a field) ---
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  // --- Re-validate on every change (only shows error if field was already touched) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") setMobile(value);
    if (name === "password") setPassword(value);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  // --- Validate everything on submit and call API ---
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileError = validate("mobile", mobile);
    const passwordError = validate("password", password);

    // Mark both fields as touched so errors show
    setTouched({ mobile: true, password: true });
    setErrors({ mobile: mobileError, password: passwordError });

    // Stop here if there are errors
    if (mobileError || passwordError) return;

    setLoading(true);
    try {
      const response = await api.post(
        `/login?mobile=${mobile}&password=${password}`,
      );
      console.log("Response:", response.data.user);
    

      if (response && response.data && response.data.status === true) {
        sessionStorage.setItem("token", response.data.authorisation.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        login(response.data);
        navigate("/attendance");
        
      } else if (response && response.data && response.data.status === false) {
        setErrors((prev) => ({
          ...prev,
          "Invalid Details":
            response.data.message || "Invalid mobile number or password.",
        }));
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors((prev) => ({
        ...prev,
        "Invalid Details": "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="login-form__header">
        <h1 className="login-form__title">Welcome Back!</h1>
        <p className="login-form__subtitle">
          Sign in to continue to USM Infra Pulse.
        </p>
      </div>

      <form className="login-form__body" onSubmit={handleSubmit} noValidate>
        {/* Mobile Number */}
        <div className="login-form__field">
          <label className="login-form__label" htmlFor="mobile">
            Mobile Number
          </label>
          <input
            id="mobile"
            name="mobile"
            type="tel"
            className={`login-form__input ${
              errors.mobile ? "login-form__input--error" : ""
            }`}
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.mobile && (
            <span className="login-form__error">{errors.mobile}</span>
          )}
          {errors["Invalid Details"] && (
            <div className="login-form__error login-form__error--api">
              {errors["Invalid Details"]}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="login-form__field">
          <label className="login-form__label" htmlFor="password">
            Password
          </label>
          <div className="login-form__input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={`login-form__input login-form__input--password ${
                errors.password ? "login-form__input--error" : ""
              }`}
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="button"
              className="login-form__eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className="login-form__error">{errors.password}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`login-form__btn${loading ? " login-form__btn--loading" : ""}`}
          disabled={loading}
        >
          {loading ? <span className="login-form__spinner" /> : "Sign In"}
        </button>
      </form>

      <footer className="login-form__footer">
        © {new Date().getFullYear()} USM Infrastructures Private Limited. All
        Rights Reserved.
      </footer>
    </div>
  );
}

export default LoginForm;
