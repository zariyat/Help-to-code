// SortingDropdown.js

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const SortingDropdown = ({ sortingOptions, sortHandler }) => {
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();
  const sortQuery = searchParams.get("sort") || "";
  return (
    <div className=" ">
      <div className="relative">
        <button
          className="  border text-black text-sm p-2 px-4 rounded  m-1"
          onMouseOver={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {sortQuery === ""
            ? "Recommend"
            : sortingOptions.find((x) => x.value === sortQuery).name}
        </button>
        <ul
          className={`transition-transform ${
            show ? "scale-100" : "scale-0"
          } absolute bg-white p-2 rounded-md shadow-md z-50`}
          onMouseOver={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          {sortingOptions.map((option, i) => (
            <li
              key={i}
              onClick={() => sortHandler(option.value)}
              className="p-2 hover:bg-slate-100 cursor-pointer"
            >
              <a>{sortQuery === option.value ? option.name : option.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SortingDropdown;
