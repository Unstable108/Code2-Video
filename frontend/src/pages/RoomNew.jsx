import React from "react";
// import new_logo from "../images/new_logo.png";

const RoomNew = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}

      {/* <header className="flex justify-center items-center text-center p-4 flex-shrink-0">
        <img src={new_logo} alt="Code2`Video Logo" className="w-40 h-auto" />
      </header> */}

      <header className="text-center p-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold">Code2Video</h1>
      </header>

      {/* Reduced Size Div Below Header */}
      <section className="grid grid-cols-1 p-1 h-14 flex-shrink-0">
        <div className="h-full rounded bg-orange-500 shadow-xl overflow-hidden">
          {/* Add your component here */}
        </div>
      </section>

      {/* Main Two-Grid Section */}
      <section className="grid grid-cols-1 sm:grid-cols-12 gap-1 p-2 flex-grow min-h-0">
        <div className="rounded bg-teal-500 shadow-xl sm:col-span-8 overflow-y-auto h-full">
          {/* Component content fits here */}
        </div>
        <div className="rounded bg-red-500 shadow-xl sm:col-span-4 overflow-y-auto h-full">
          {/* Component content fits here */}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-1 h-44 flex-shrink-0">
        <div className="rounded bg-orange-500 shadow-xl sm:col-span-1 overflow-hidden">
          {/* Add footer content */}
        </div>
        <div className="rounded bg-teal-500 shadow-xl sm:col-span-11 overflow-hidden">
          {/* Add footer content */}
        </div>
      </footer>
    </div>
  );
};

export default RoomNew;
