import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../utils/api";

const NodeAuth = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = (result) => {
    const { email, name, image } = result.data.user;
    const token = result.data.token;
    const userInfo = { email, name, token, image, authProvider: "google" };
    localStorage.setItem("user-info", JSON.stringify(userInfo));
    navigate("/dashboard");
  };

  const handleAuthError = (error) => {
    console.error("Authentication Error:", error);
  };

  const handleGoogleResponse = async (authResult) => {
    try {
      if (authResult?.code) {
        const result = await googleAuth(authResult.code);
        handleAuthSuccess(result);
      } else {
        throw new Error("Google auth code missing or invalid.");
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  const initiateGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: handleAuthError,
    flow: "auth-code",
  });

  const handleGitHubLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const authWindow = window.open(
      "http://localhost:5000/auth/github",
      "GitHub Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const receiveMessage = (event) => {
      if (event.origin !== "http://localhost:5000") return;

      const { token, user } = event.data;

      if (token && user) {
        const userInfo = { ...user, token, authProvider: "github" };
        localStorage.setItem("user-info", JSON.stringify(userInfo));
        window.removeEventListener("message", receiveMessage);
        navigate("/dashboard");
      } else {
        console.error("Invalid data received from GitHub login:", event.data);
      }
    };

    window.addEventListener("message", receiveMessage);
  };

  const handleFacebookLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const authWindow = window.open(
      "http://localhost:5000/auth/facebook",
      "Facebook Login",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const receiveMessage = (event) => {
      if (event.origin !== "http://localhost:5000") return;

      const { token, user } = event.data;

      if (token && user) {
        const userInfo = { ...user, token, authProvider: "facebook" };
        localStorage.setItem("user-info", JSON.stringify(userInfo));
        window.removeEventListener("message", receiveMessage);
        navigate("/dashboard");
      } else {
        console.error("Invalid data received from Facebook login:", event.data);
      }
    };

    window.addEventListener("message", receiveMessage);
  };

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 gap-6">
        <h2
          className="text-white text-4xl font-extrabold tracking-wide mb-6"
          style={{
            textShadow: `
              0 0 5px rgba(255,255,255,0.7),
              0 0 10px rgba(255,255,255,0.5),
              0 0 20px rgba(255,255,255,0.3)
            `,
          }}
        >
          Node.js OAuth Authentication
        </h2>
        <div className="relative p-10 sm:p-12 w-full max-w-md text-center rounded-4xl overflow-hidden bg-[#0a0a0a] border border-gray-800 shadow-[0_0_60px_rgba(255,255,255,0.06)]">
          <div className="absolute inset-0 z-0 rounded-3xl pointer-events-none">
            <div className="absolute -inset-[2px] rounded-[inherit] bg-white/10 blur-xl opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.05)]"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-white text-3xl font-extrabold mb-8 tracking-tight drop-shadow-[0_2px_6px_rgba(255,255,255,0.08)]">
              Sign in with your Socials
            </h1>

            <div className="flex flex-col gap-4">
              <button
                onClick={initiateGoogleLogin}
                className="flex items-center justify-center gap-3 w-full bg-white text-black py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-lg hover:-translate-y-[2px] hover:scale-[1.03] transition-all duration-300"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>

              <button
                onClick={handleGitHubLogin}
                className="flex items-center justify-center gap-3 w-full bg-[#171717] text-white py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-lg hover:-translate-y-[2px] hover:scale-[1.03] transition-all duration-300"
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/30/github.png"
                  alt="GitHub"
                  className="w-6 h-6 invert"
                />
                Sign in with GitHub
              </button>

              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-3 w-full bg-[#0866FF] text-white py-3 px-6 rounded-full font-semibold shadow-md hover:shadow-xl hover:-translate-y-[2px] hover:scale-[1.03] transition-all duration-300"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                Sign in with Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NodeAuth;
