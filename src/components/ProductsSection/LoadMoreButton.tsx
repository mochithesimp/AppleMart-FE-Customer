import React from "react";

interface LoadMoreButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick, isDisabled }) => {
  return (
    <div className="flex justify-center mt-6">
      {!isDisabled && (
        <button
          className="dark:bg-zinc-600 dark:hover:bg-zinc-700 px-6 py-2 bg-gray-300 text-white font-semibold rounded-lg hover:bg-red-400 transition"
          onClick={onClick}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default LoadMoreButton;
