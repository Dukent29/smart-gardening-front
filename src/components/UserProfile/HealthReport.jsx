export default function HealthReport() {
  const stats = [
    { icon: "🌱", label: "Healthy Plants", value: 5 },
    { icon: "⚠️", label: "Needs Attention", value: 2 },
    { icon: "💧", label: "Watered Today", value: 3 },
  ];

  return (
    <div>
      <h3 className="font-semibold text-[#0A5D2F] mb-2">Health Report</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center bg-gray-50 rounded-lg p-3 shadow-sm"
          >
            <span className="text-2xl">{stat.icon}</span>
            <span className="font-bold text-lg">{stat.value}</span>
            <span className="text-xs text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}