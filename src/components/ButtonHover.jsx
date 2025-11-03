// export default function ButtonHover() {
//   return (
//     <div className="group relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-full border border-white/10 text-white transition-all duration-300 hover:w-[140px] hover:bg-white/10 cursor-pointer">

//       <span className="absolute text-sm font-medium text-yellow-400 transition-all duration-300 opacity-0 left-5 whitespace-nowrap group-hover:opacity-100">
//         Xem thêm
//       </span>

//       <i className="fa-solid fa-chevron-right text-sm transition-all duration-300 group-hover:text-yellow-400 group-hover:translate-x-[45px]"></i>
//     </div>
//   );
// }

export default function ButtonHover({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-center justify-center h-10 w-10 overflow-hidden rounded-full border border-white/10 text-white transition-all duration-300 hover:w-[140px] hover:bg-white/10 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
    >
      <span className="absolute text-sm font-medium text-yellow-400 transition-all duration-300 opacity-0 left-5 whitespace-nowrap group-hover:opacity-100">
        Xem thêm
      </span>
      <i className="fa-solid fa-chevron-right text-sm transition-all duration-300 group-hover:text-yellow-400 group-hover:translate-x-[45px]"></i>
    </div>
  );
}
