export default function HelpSupport() {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">Help &amp; Support</h3>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
          <span>❓</span>
          <span>FAQ</span>
        </li>
        <li className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
          <span>📧</span>
          <span>Contact Support</span>
        </li>
        <li className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
          <span>📄</span>
          <span>User Guide</span>
        </li>
      </ul>
    </div>
    );
}