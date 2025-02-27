import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 mt-auto text-center text-sm text-gray-600">
      <p>
        ©{currentYear}{" "}
        <a href="https://www.jmsoftware.co.uk" className="hover:text-gray-800">
          Jonathan Mathews Software
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
