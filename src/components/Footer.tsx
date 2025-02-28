export default function Footer() {
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
}
