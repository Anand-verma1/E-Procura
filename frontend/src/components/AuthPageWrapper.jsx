import AuthCard from "../context/AuthCard";
function AuthPageWrapper() {
    return (
        <>
        <div className="relative w-full h-screen overflow-hidden">

      {/* 🔹 Background Video */}
      <img
  src="../../assets/iitbhilai1.jpg"
  alt="background"
  className="absolute top-0 left-0 w-full h-full object-fill"
/>
      {/* 🔹 Dark overlay */}
      <div className="absolute inset-0 bg-[var(--primary)]/50"></div>

      {/* 🔹 Content Area */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-between px-4 sm:px-10 md:px-20 h-full gap-8 py-8 md:py-0">

        {/* LEFT SIDE TEXT */}
        <div className="text-white space-y-3 max-w-xl animate-fadeInUp text-center md:text-left">
          <h3 className="text-sm sm:text-lg font-semibold tracking-wide text-[var(--soft)] drop-shadow-md">PROCUREMENT 2025</h3>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight
bg-gradient-to-r from-[#eff6e0] to-[#aec3b0]
text-transparent bg-clip-text drop-shadow-xl">
  PROCUREMENT MANAGEMENT SYSTEM
</h1>

          <h2 className="text-lg sm:text-2xl font-semibold text-[var(--light)] drop-shadow-md tracking-wide">
            Fund Allocation & Approvals
          </h2>
        </div>

        {/* RIGHT SIDE AUTH FORM */}
        <div className="w-full max-w-sm">
          <AuthCard />
        </div>
      </div>
    </div>
        </>
    );
}

export default AuthPageWrapper;