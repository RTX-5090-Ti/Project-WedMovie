export function ContentMovie() {
  return (
    <div className="w-full h-[700px] relative mb-[30px]">
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_40%,rgba(0,0,0,0.8)_100%)]"></div>
      <div className="absolute left-0 right-0 top-0 z-30  h-[100px] bg-gradient-to-b from-black/80 to-[rgba(0,0,0,0.0)]"></div>

      <img
        className="object-contain w-full h-full "
        src="/images/test/pacific_rim_uprising_ver25_xlg.jpg"
        alt="logo"
      />
      <div className="absolute z-20 bottom-[15%] left-[80px] flex flex-col gap-5">
        <p className="text-[50px] font-bold">Pacific Rim</p>
        <div className="inline-flex gap-[5px]">
          <span className="py-[2px] px-1 border border-[#f0d25b] rounded-lg text-[#f0d25b]">
            IMDb <span className="text-white">7.5</span>
          </span>
          <span className="py-[2px] px-1 border border-white rounded-lg ">
            2025
          </span>
        </div>
        <div className="inline-flex gap-[5px]">
          <span className="py-[2px] px-1 border border-white rounded-[4px] bg-[rgba(0,0,0,0.25)] shadow-md shadow-[rgba(0,0,0,0.25)] p-4 rounded-md">
            Hành Động
          </span>
          <span className="py-[2px] px-1 border border-white rounded-[4px] bg-[rgba(0,0,0,0.25)] shadow-md shadow-[rgba(0,0,0,0.25)] p-4 rounded-md">
            Chiếu Rạp
          </span>
          <span className="py-[2px] px-1 border border-white rounded-[4px] bg-[rgba(0,0,0,0.25)] shadow-md shadow-[rgba(0,0,0,0.25)] p-4 rounded-md">
            Khoa học viễn tưởng
          </span>
          <span className="py-[2px] px-1 border border-white rounded-[4px] bg-[rgba(0,0,0,0.25)] shadow-md shadow-[rgba(0,0,0,0.25)] p-4 rounded-md">
            Robot
          </span>
        </div>
        <p className="max-w-[700px] leading-relaxed text-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
          natus ipsam unde necessitatibus inventore ipsa, minus animi, delectus
          odit amet nesciunt repellendus ipsum cumque quisquam repudiandae sequi
          blanditiis distinctio dignissimos.
        </p>
        <div className="inline-flex items-center gap-8">
          <img
            className="w-[70px] cursor-pointer"
            src="/images/logo-header/play.gif"
            alt="play"
          />
          <span className="group p-[8px] rounded-full border-2 border-[rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-white">
            <i className="fa-solid fa-heart text-[20px] text-white transition-all duration-300 group-hover:text-red-500"></i>
          </span>
        </div>
      </div>
    </div>
  );
}
