import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
export const Header = ({ onLanguageChange, currentLanguage }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {user ? t("common.welcome_back") : t("common.welcome")}
      </h1>

      {/* Hiển thị thông tin user nếu đã login */}
      {user && (
        <div className="mb-4">
          <p className="text-lg text-gray-600">
            {t("common.hello")},{" "}
            <span className="font-semibold">{user.username}</span>!
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
        {/* Language Selector */}
        <div className="flex space-x-2">
          <button
            onClick={() => onLanguageChange("vi")}
            className={`px-3 py-1 rounded ${
              currentLanguage === "vi"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            VI
          </button>
          <button
            onClick={() => onLanguageChange("en")}
            className={`px-3 py-1 rounded ${
              currentLanguage === "en"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange("ja")}
            className={`px-3 py-1 rounded ${
              currentLanguage === "ja"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            日本語
          </button>
        </div>

        {/* Logout Button (chỉ hiện khi đã login) */}
        {user && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {t("common.logout")}
          </button>
        )}
      </div>
    </div>
  );
};
