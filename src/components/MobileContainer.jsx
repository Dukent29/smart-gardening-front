export default function MobileContainer({ children, className = "" }) {
  return (
    <div className={`w-full max-w-md mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
}