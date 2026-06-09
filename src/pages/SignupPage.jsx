import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { signupUser, loginUser, clearError, resetSignupSuccess } from "../store/authSlice";
import { toast } from "sonner";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = async (data) => {
    try {
      // 1. Signup user — backend returns { success, message, data: { user } }
      const result = await dispatch(signupUser(data)).unwrap();
      const successMessage = result?.message || "Account created successfully!";
      toast.success(successMessage);

      // 2. Automatically log in user
      await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
      toast.success("Logged in automatically!");

      dispatch(resetSignupSuccess());
      navigate("/dashboard");
    } catch (err) {
      // err is the string message stored by rejectWithValue in authSlice
      toast.error(typeof err === "string" ? err : "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-6 select-none">
      <div className="w-full max-w-md bg-surface-container-lowest dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-800 transition-all">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-indigo-700 dark:text-indigo-300 tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Join Curator AI to analyze and optimize your resumes.
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container text-xs font-semibold rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 dark:text-slate-200 outline-none transition-all"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-error font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">warning</span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-2">
              Password
            </label>
            
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  validate: {
                    hasUppercase: (value) =>
                      /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
                    hasLowercase: (value) =>
                      /[a-z]/.test(value) || "Must contain at least one lowercase letter",
                    hasDigit: (value) =>
                      /[0-9]/.test(value) || "Must contain at least one digit",
                  },
                })}
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 dark:text-slate-200 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none flex items-center"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-error font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">warning</span>
                {errors.password.message}
              </p>
            )}
            <p className="mt-2 text-[10px] text-on-surface-variant font-medium">
              Must contain 8+ characters with uppercase, lowercase, and a digit.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-gradient text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-95 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <p className="text-xs text-on-surface-variant">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
