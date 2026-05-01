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
      <div className="relative z-10 flex items-center justify-between px-20 h-full">

        {/* LEFT SIDE TEXT */}
        <div className="text-white space-y-3 max-w-xl animate-fadeInUp border ">
          <h3 className="text-lg font-semibold tracking-wide text-[var(--soft)] drop-shadow-md ">PROCUREMENT 2025</h3>

          <h1 className="text-5xl font-extrabold leading-tight 
bg-gradient-to-r from-[#eff6e0] to-[#aec3b0]
text-transparent bg-clip-text drop-shadow-xl">
  PROCUREMENT MANAGEMENT SYSTEM
</h1>



          <h2 className="text-2xl font-semibold text-[var(--light)] drop-shadow-md
 tracking-wide">
            Fund Allocation & Approvals
          </h2>
        </div>

        {/* RIGHT SIDE AUTH FORM */}
        <AuthCard />
      </div>
    </div>
        </>
    );
}

export default AuthPageWrapper;