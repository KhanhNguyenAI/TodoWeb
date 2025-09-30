import React from "react";
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50">
      <img
        src="404_NotFound.png"
        alt="NotFound"
        className="max-w-full mb-6 w-96"
      />
      <a
        href="/"
        className="inline-block px-6 py-3 mt-6 font-medium text-white transition shadow-md bg-primary rounded-2x1 hover:bg-primary-dark"
      >
        Address Not Found!! Please back the Home Page
      </a>
    </div>
  );
};

export default NotFound;
