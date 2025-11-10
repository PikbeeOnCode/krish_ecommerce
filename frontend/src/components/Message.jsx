const Message = ({ variant, children }) => {
  const getVariantClass = () => {  // Fixed: arrow function syntax
    switch (variant) {  // Fixed: curly brace
      case "success":  // Fixed: typo "succcess" -> "success"
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }  // Added missing closing brace
  };

  return <div className={`p-4 rounded ${getVariantClass()}`}>{children}</div>;  // Fixed: template literal syntax
};

export default Message;