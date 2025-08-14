import React, { useState, useRef, useEffect } from "react";
import {
  downloadDocumentAsPDF,
  downloadAsWord,
  downloadAsHTML,
  downloadAsText,
} from "../services/downloadService";
import { FaDownload, FaChevronDown, FaChevronUp } from "react-icons/fa";

const DownloadDropdown = ({ doc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const handleDownload = async (format) => {
    try {
      if (format === "pdf") await downloadDocumentAsPDF(doc);
      if (format === "word") await downloadAsWord(doc);
      if (format === "html") await downloadAsHTML(doc);
      if (format === "text") await downloadAsText(doc);
      setIsOpen(false);
    } catch (e) {
      console.error("Download failed:", e);
      alert("Download failed. Please try again.");
    }
  };

  // Close on outside click / Esc
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <FaDownload className="w-4 h-4" />
        {isOpen ? (
          <FaChevronUp className="w-4 h-4" />
        ) : (
          <FaChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999]"
        >
          <div className="py-1">
            <button
              onClick={() => handleDownload("pdf")}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
            >
               Download as PDF
            </button>
            <button
              onClick={() => handleDownload("word")}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
            >
               Download as Word
            </button>
            <button
              onClick={() => handleDownload("html")}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
            >
               Download as HTML
            </button>
            <button
              onClick={() => handleDownload("text")}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
            >
               Download as Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadDropdown;
