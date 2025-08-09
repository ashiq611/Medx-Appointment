import React from 'react';

interface ButtonProps {
  type: 'submit' | 'success' | 'delete' | 'plain' | 'alternative' | 'dark';
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, text, onClick }) => {
  let buttonClasses = 'text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none focus:ring-4 ';

  switch (type) {
    case 'submit':
      buttonClasses += 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 font-bold';
      break;
    case 'success':
      buttonClasses += 'bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 font-bold';
      break;
    case 'delete':
      buttonClasses += 'bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold';
      break;
    case 'plain':
      buttonClasses += 'bg-white border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 font-bold';
      break;
    case 'alternative':
      buttonClasses += 'bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 font-bold';
      break;
    case 'dark':
      buttonClasses += 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 font-bold';
      break;
    default:
      buttonClasses += 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 font-bold';
      break;
  }

  return (
    <button type="button" className={buttonClasses} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
